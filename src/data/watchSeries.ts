// ═══════════════════════════════════════════════════════════════════
// Watch Series — All Night & Morning Watch content data
// ═══════════════════════════════════════════════════════════════════

import { Heart, Brain, Flame, Wind } from "lucide-react";

// ── Types ──

export interface WatchSession {
  dayNumber: number;
  title: string;
  scripture: string;
  scene: string;
  masterMindInsight: string;
  mood: string;
  struggle: string;
  entryType: string;
  metaphor: string;
}

export interface MorningWatchSession {
  dayNumber: number;
  title: string;
  pairedNightTitle: string;
  nightInsight: string;
  nightScripture: string;
  morningScripture: string;
  activationPrinciple: string;
  energy: string;
  openingType: string;
  commitmentStyle: string;
  scenarioTypes: string[];
}

export interface SeriesBlock {
  name: string;
  dayRange: [number, number];
  sessions: number;
  scriptureScope: string;
  throughline: string;
}

export interface WeekOverview {
  week: number;
  title: string;
  theme: string;
  scriptureRange: string;
}

export interface WatchTract {
  id: string;
  name: string;
  subtitle: string;
  type: "free" | "40-day" | "365-day";
  totalSessions: number;
  description: string;
  throughline: string;
  icon: string;
  sessions: WatchSession[];
  mornings?: MorningWatchSession[];
  weekOverviews?: WeekOverview[];
  seriesBlocks?: SeriesBlock[];
  isFree?: boolean;
}

// ── Style Maps ──

export const MOOD_COLORS: Record<string, string> = {
  awe: "bg-indigo-500/20 text-indigo-300",
  intimate: "bg-rose-500/20 text-rose-300",
  tension: "bg-amber-500/20 text-amber-300",
  grief: "bg-slate-500/20 text-slate-300",
  triumph: "bg-yellow-500/20 text-yellow-300",
  rest: "bg-emerald-500/20 text-emerald-300",
  wonder: "bg-purple-500/20 text-purple-300",
  dread: "bg-red-500/20 text-red-300",
  sorrow: "bg-slate-500/20 text-slate-300",
  resolve: "bg-blue-500/20 text-blue-300",
  surrender: "bg-violet-500/20 text-violet-300",
  agony: "bg-red-600/20 text-red-300",
  desolation: "bg-gray-500/20 text-gray-300",
  peace: "bg-teal-500/20 text-teal-300",
  glory: "bg-amber-500/20 text-amber-300",
};

export const ENERGY_COLORS: Record<string, string> = {
  bold: "bg-amber-500/20 text-amber-300",
  steady: "bg-blue-500/20 text-blue-300",
  gentle: "bg-rose-500/20 text-rose-300",
  urgent: "bg-red-500/20 text-red-300",
  joyful: "bg-yellow-500/20 text-yellow-300",
  still: "bg-emerald-500/20 text-emerald-300",
};

export const STRUGGLE_ICONS: Record<string, typeof Heart> = {
  anxiety: Wind,
  burnout: Flame,
  doubt: Brain,
  fear: Heart,
  shame: Heart,
  pride: Flame,
  despair: Heart,
  anger: Flame,
  loneliness: Heart,
  guilt: Brain,
  grief: Heart,
  betrayal: Heart,
};

// ═══════════════════════════════════════════════════════════════════
// 7-DAY CREATION SERIES
// ═══════════════════════════════════════════════════════════════════

const CREATION_NIGHT: WatchSession[] = [
  { dayNumber: 1, title: "The Mind That Speaks Light", scripture: "Genesis 1:1-3", scene: "Darkness, void, then voice. Light breaks in.", masterMindInsight: "Christ speaks light into darkness without waiting for conditions to improve.", mood: "awe", struggle: "anxiety", entryType: "A", metaphor: "light" },
  { dayNumber: 2, title: "The Mind That Makes Space", scripture: "Genesis 1:6-8", scene: "Waters above, waters below. An expanse is made.", masterMindInsight: "The Master Mind creates space — separation is not rejection, it's architecture.", mood: "rest", struggle: "burnout", entryType: "D", metaphor: "water" },
  { dayNumber: 3, title: "The Mind That Calls Forth", scripture: "Genesis 1:9-13", scene: "Land rises from water. Seeds open. Green appears.", masterMindInsight: "Christ doesn't build from nothing — He calls out what's already hidden inside.", mood: "wonder", struggle: "doubt", entryType: "G", metaphor: "walk" },
  { dayNumber: 4, title: "The Mind That Marks Time", scripture: "Genesis 1:14-19", scene: "Sun, moon, stars placed as signs and seasons.", masterMindInsight: "The Master Mind doesn't rush — it establishes rhythm before expecting fruit.", mood: "awe", struggle: "burnout", entryType: "F", metaphor: "light" },
  { dayNumber: 5, title: "The Mind That Fills", scripture: "Genesis 1:20-23", scene: "Waters teem, skies fill, abundance everywhere.", masterMindInsight: "Christ's thinking is abundance, not scarcity — He fills until it overflows.", mood: "wonder", struggle: "fear", entryType: "K", metaphor: "sound" },
  { dayNumber: 6, title: "The Mind That Images", scripture: "Genesis 1:26-28", scene: "Dust. Breath. Image. Dominion given.", masterMindInsight: "The Master Mind shares itself — it does not hoard its nature but imprints it.", mood: "intimate", struggle: "shame", entryType: "E", metaphor: "room" },
  { dayNumber: 7, title: "The Mind That Rests", scripture: "Genesis 2:1-3", scene: "Everything complete. Nothing missing. Sabbath.", masterMindInsight: "The Master Mind knows when to stop — rest is not absence of work, it's the crown of it.", mood: "rest", struggle: "anxiety", entryType: "L", metaphor: "screen" },
];

const CREATION_MORNING: MorningWatchSession[] = [
  { dayNumber: 1, title: "Speak Light Today", pairedNightTitle: "The Mind That Speaks Light", nightInsight: "Christ speaks light into darkness without waiting for conditions to improve.", nightScripture: "Genesis 1:1-3", morningScripture: "Genesis 1:3; John 1:5", activationPrinciple: "You speak truth into confusion without waiting until you feel ready.", energy: "bold", openingType: "A", commitmentStyle: "Declaration", scenarioTypes: ["internal", "relational", "environmental"] },
  { dayNumber: 2, title: "Make Space Today", pairedNightTitle: "The Mind That Makes Space", nightInsight: "The Master Mind creates space — separation is not rejection, it's architecture.", nightScripture: "Genesis 1:6-8", morningScripture: "Genesis 1:6-8", activationPrinciple: "You create boundaries today — not walls of rejection, but architecture of health.", energy: "still", openingType: "D", commitmentStyle: "If/Then", scenarioTypes: ["internal", "environmental", "relational"] },
  { dayNumber: 3, title: "Call It Forth Today", pairedNightTitle: "The Mind That Calls Forth", nightInsight: "Christ doesn't build from nothing — He calls out what's already hidden inside.", nightScripture: "Genesis 1:9-13", morningScripture: "Genesis 1:11-12", activationPrinciple: "You stop looking for something new — you call out what God already placed within you.", energy: "joyful", openingType: "H", commitmentStyle: "Single Sentence", scenarioTypes: ["identity", "internal", "relational"] },
  { dayNumber: 4, title: "Honor the Rhythm Today", pairedNightTitle: "The Mind That Marks Time", nightInsight: "The Master Mind doesn't rush — it establishes rhythm before expecting fruit.", nightScripture: "Genesis 1:14-19", morningScripture: "Genesis 1:14; Ecclesiastes 3:1", activationPrinciple: "You stop measuring by output — you honor the rhythm, and trust the fruit will come.", energy: "steady", openingType: "G", commitmentStyle: "Gratitude + Forward", scenarioTypes: ["environmental", "internal", "temptation"] },
  { dayNumber: 5, title: "Think Abundance Today", pairedNightTitle: "The Mind That Fills", nightInsight: "Christ's thinking is abundance, not scarcity — He fills until it overflows.", nightScripture: "Genesis 1:20-23", morningScripture: "Genesis 1:22; John 10:10", activationPrinciple: "You think from fullness today — not from what's missing, but from what's been given.", energy: "joyful", openingType: "E", commitmentStyle: "Identity Reminder", scenarioTypes: ["internal", "relational", "environmental"] },
  { dayNumber: 6, title: "See the Image Today", pairedNightTitle: "The Mind That Images", nightInsight: "The Master Mind shares itself — it does not hoard its nature but imprints it.", nightScripture: "Genesis 1:26-28", morningScripture: "Genesis 1:27; 2 Corinthians 3:18", activationPrinciple: "You see others as image-bearers today — including yourself.", energy: "gentle", openingType: "F", commitmentStyle: "Prayer", scenarioTypes: ["relational", "identity", "relational"] },
  { dayNumber: 7, title: "Rest Without Guilt Today", pairedNightTitle: "The Mind That Rests", nightInsight: "The Master Mind knows when to stop — rest is not absence of work, it's the crown of it.", nightScripture: "Genesis 2:1-3", morningScripture: "Genesis 2:2-3; Hebrews 4:9-10", activationPrinciple: "You stop when it's time to stop — without guilt, without anxiety, as an act of trust.", energy: "still", openingType: "B", commitmentStyle: "Silence + Resolve", scenarioTypes: ["internal", "temptation", "environmental"] },
];

// ═══════════════════════════════════════════════════════════════════
// 40-DAY PASSION TRACT (FREE — featured public tract)
// "The Mind That Surrenders to Win"
// ═══════════════════════════════════════════════════════════════════

const PASSION_NIGHT: WatchSession[] = [
  // Week 1: The Upper Room (Days 1-7)
  { dayNumber: 1, title: "The Mind That Washes Feet", scripture: "John 13:1-17", scene: "A basin. A towel. The King kneels.", masterMindInsight: "Christ leads by descending — authority flows downward, not upward.", mood: "intimate", struggle: "pride", entryType: "A", metaphor: "water" },
  { dayNumber: 2, title: "The Mind That Breaks Bread", scripture: "Luke 22:14-20", scene: "Bread torn. Wine poured. 'This is my body.'", masterMindInsight: "The Master Mind offers Himself before being taken — the gift precedes the demand.", mood: "intimate", struggle: "fear", entryType: "D", metaphor: "room" },
  { dayNumber: 3, title: "The Mind That Names Betrayal", scripture: "John 13:21-30", scene: "A dipped morsel. A dark departure. Night.", masterMindInsight: "Christ names the wound without retaliating — truth doesn't need revenge.", mood: "tension", struggle: "betrayal", entryType: "G", metaphor: "light" },
  { dayNumber: 4, title: "The Mind That Promises Presence", scripture: "John 14:1-14", scene: "'I will not leave you orphaned. I go to prepare.'", masterMindInsight: "The Master Mind comforts by revealing destination — anxiety dies when the road has an end.", mood: "rest", struggle: "anxiety", entryType: "F", metaphor: "walk" },
  { dayNumber: 5, title: "The Mind That Sends Another", scripture: "John 14:15-27", scene: "The Comforter is promised. Peace is left behind.", masterMindInsight: "Christ's absence creates space for a deeper presence — the Spirit indwells, not just accompanies.", mood: "wonder", struggle: "loneliness", entryType: "K", metaphor: "room" },
  { dayNumber: 6, title: "The Mind That Is the Vine", scripture: "John 15:1-17", scene: "Branches connected, pruned, bearing fruit.", masterMindInsight: "The Master Mind stays connected — fruitfulness is not effort, it's attachment.", mood: "rest", struggle: "burnout", entryType: "E", metaphor: "walk" },
  { dayNumber: 7, title: "The Mind That Prays for Unity", scripture: "John 17:1-26", scene: "Eyes lifted. The Son speaks to the Father about you.", masterMindInsight: "Christ's final prayer isn't for rescue — it's for oneness. His deepest desire is union.", mood: "intimate", struggle: "loneliness", entryType: "L", metaphor: "light" },

  // Week 2: Gethsemane (Days 8-14)
  { dayNumber: 8, title: "The Mind That Walks Into the Dark", scripture: "Matthew 26:36-38", scene: "The garden at night. Three chosen. 'Stay and watch.'", masterMindInsight: "Christ moves toward suffering, not away — courage is not the absence of dread, but the choice to advance.", mood: "dread", struggle: "fear", entryType: "A", metaphor: "walk" },
  { dayNumber: 9, title: "The Mind That Falls on Its Face", scripture: "Matthew 26:39", scene: "Knees buckle. Face to earth. 'If it be possible.'", masterMindInsight: "The Master Mind does not suppress emotion — it brings the full weight of feeling to the Father.", mood: "agony", struggle: "anxiety", entryType: "D", metaphor: "room" },
  { dayNumber: 10, title: "The Mind That Says 'Not My Will'", scripture: "Luke 22:42", scene: "The cup. The choice. Surrender.", masterMindInsight: "Christ surrenders preference without surrendering trust — 'not my will' is not defeat, it's deepest strength.", mood: "surrender", struggle: "doubt", entryType: "G", metaphor: "water" },
  { dayNumber: 11, title: "The Mind That Sweats Blood", scripture: "Luke 22:43-44", scene: "An angel appears. Sweat like drops of blood.", masterMindInsight: "The Master Mind receives help without shame — even Christ accepted angelic strength.", mood: "agony", struggle: "shame", entryType: "F", metaphor: "light" },
  { dayNumber: 12, title: "The Mind That Finds Friends Sleeping", scripture: "Matthew 26:40-46", scene: "Three times He returns. Three times they sleep.", masterMindInsight: "Christ carries what others cannot — disappointment in people doesn't become bitterness.", mood: "grief", struggle: "loneliness", entryType: "K", metaphor: "room" },
  { dayNumber: 13, title: "The Mind That Faces the Mob", scripture: "John 18:1-11", scene: "Torches. Swords. A kiss. 'I AM.'", masterMindInsight: "The Master Mind doesn't hide its identity under threat — 'I AM' is spoken, and the mob falls.", mood: "awe", struggle: "fear", entryType: "E", metaphor: "light" },
  { dayNumber: 14, title: "The Mind That Heals the Enemy", scripture: "Luke 22:49-51", scene: "A severed ear. A touch. Healing in the arrest.", masterMindInsight: "Christ heals those who come to harm Him — mercy operates independent of circumstances.", mood: "wonder", struggle: "anger", entryType: "L", metaphor: "water" },

  // Week 3: The Trials (Days 15-21)
  { dayNumber: 15, title: "The Mind That Stands Silent", scripture: "Matthew 26:62-63", scene: "Accusations fly. The accused says nothing.", masterMindInsight: "The Master Mind doesn't defend itself — silence before lies is stronger than argument.", mood: "resolve", struggle: "anger", entryType: "A", metaphor: "room" },
  { dayNumber: 16, title: "The Mind That Sees Peter", scripture: "Luke 22:54-62", scene: "A courtyard fire. Three denials. One look.", masterMindInsight: "Christ looks at Peter without condemnation — His gaze breaks, but it doesn't destroy.", mood: "grief", struggle: "shame", entryType: "D", metaphor: "light" },
  { dayNumber: 17, title: "The Mind That Answers Pilate", scripture: "John 18:33-38", scene: "'What is truth?' — asked by the man looking at it.", masterMindInsight: "The Master Mind states truth without needing it to be received — truth doesn't require agreement.", mood: "resolve", struggle: "doubt", entryType: "G", metaphor: "walk" },
  { dayNumber: 18, title: "The Mind That Wears the Robe", scripture: "Matthew 27:27-31", scene: "Purple robe. Thorn crown. Mock worship.", masterMindInsight: "Christ wears mockery without losing identity — humiliation can't reach what's anchored in the Father.", mood: "grief", struggle: "shame", entryType: "F", metaphor: "room" },
  { dayNumber: 19, title: "The Mind That Is Scourged", scripture: "John 19:1-3", scene: "Flesh torn. Blood runs. The world watches.", masterMindInsight: "The Master Mind absorbs violence without transmitting it — pain enters but poison doesn't exit.", mood: "agony", struggle: "anger", entryType: "K", metaphor: "water" },
  { dayNumber: 20, title: "The Mind That Is Chosen Against", scripture: "Matthew 27:15-26", scene: "'Give us Barabbas!' The crowd chooses the criminal.", masterMindInsight: "Christ is rejected by the crowd without rejecting the crowd — being unchosen doesn't determine worth.", mood: "desolation", struggle: "loneliness", entryType: "E", metaphor: "room" },
  { dayNumber: 21, title: "The Mind That Carries the Beam", scripture: "Luke 23:26-32", scene: "Wood on shoulders. The road to Golgotha.", masterMindInsight: "The Master Mind carries what was placed on it — the weight is real, the destination is chosen.", mood: "resolve", struggle: "burnout", entryType: "L", metaphor: "walk" },

  // Week 4: The Cross — Seven Last Words (Days 22-28)
  { dayNumber: 22, title: "The Mind That Forgives Mid-Execution", scripture: "Luke 23:33-34", scene: "Nails driven. 'Father, forgive them.'", masterMindInsight: "Christ forgives before being asked — mercy doesn't wait for repentance.", mood: "awe", struggle: "anger", entryType: "A", metaphor: "light" },
  { dayNumber: 23, title: "The Mind That Opens Paradise", scripture: "Luke 23:39-43", scene: "A thief asks. 'Today you will be with me.'", masterMindInsight: "The Master Mind grants access at the last possible moment — it's never too late for grace.", mood: "wonder", struggle: "despair", entryType: "D", metaphor: "walk" },
  { dayNumber: 24, title: "The Mind That Provides Family", scripture: "John 19:25-27", scene: "'Woman, behold your son.' A new family is made.", masterMindInsight: "Christ creates belonging from the cross — even in agony, He arranges love for others.", mood: "intimate", struggle: "loneliness", entryType: "G", metaphor: "room" },
  { dayNumber: 25, title: "The Mind That Cries 'Why?'", scripture: "Matthew 27:45-46", scene: "Darkness. 'My God, my God, why have you forsaken me?'", masterMindInsight: "The Master Mind brings even abandonment to the Father — the cry 'why' is faith, not failure.", mood: "desolation", struggle: "despair", entryType: "F", metaphor: "sound" },
  { dayNumber: 26, title: "The Mind That Thirsts", scripture: "John 19:28", scene: "'I thirst.' The Creator of water asks for water.", masterMindInsight: "Christ acknowledges need without shame — true strength admits what it lacks.", mood: "grief", struggle: "shame", entryType: "K", metaphor: "water" },
  { dayNumber: 27, title: "The Mind That Finishes", scripture: "John 19:29-30", scene: "'It is finished.' Not a gasp — a declaration.", masterMindInsight: "The Master Mind completes what it starts — 'finished' means nothing left undone.", mood: "triumph", struggle: "doubt", entryType: "E", metaphor: "light" },
  { dayNumber: 28, title: "The Mind That Commits Its Spirit", scripture: "Luke 23:46", scene: "'Father, into your hands.' Trust in the final breath.", masterMindInsight: "Christ dies giving, not grasping — the last act is surrender, and surrender is victory.", mood: "peace", struggle: "fear", entryType: "L", metaphor: "room" },

  // Week 5: The Tomb & Resurrection (Days 29-35)
  { dayNumber: 29, title: "The Mind in the Silence", scripture: "Matthew 27:57-60", scene: "A borrowed tomb. Linen. Stone rolled shut.", masterMindInsight: "The Master Mind rests even in death — silence is not absence, it's gestation.", mood: "rest", struggle: "anxiety", entryType: "A", metaphor: "room" },
  { dayNumber: 30, title: "The Mind That Harrowed Hell", scripture: "1 Peter 3:18-20", scene: "Between death and dawn, Christ descended. He preached.", masterMindInsight: "Christ doesn't waste even death — every space becomes a stage for liberation.", mood: "awe", struggle: "despair", entryType: "D", metaphor: "walk" },
  { dayNumber: 31, title: "The Mind That Breaks the Stone", scripture: "Matthew 28:1-6", scene: "Earthquake. Angel. Empty tomb. 'He is not here.'", masterMindInsight: "The Master Mind cannot be contained — what was sealed is now open, permanently.", mood: "triumph", struggle: "doubt", entryType: "G", metaphor: "light" },
  { dayNumber: 32, title: "The Mind That Calls Mary's Name", scripture: "John 20:11-18", scene: "A garden. Tears. 'Mary.' She turns and sees.", masterMindInsight: "Christ reveals Himself through the personal — He speaks your name before He explains theology.", mood: "intimate", struggle: "grief", entryType: "F", metaphor: "sound" },
  { dayNumber: 33, title: "The Mind That Shows Its Wounds", scripture: "John 20:19-20", scene: "Locked doors. 'Peace be with you.' He shows His hands.", masterMindInsight: "The Master Mind doesn't hide its scars — resurrection doesn't erase suffering, it redeems it.", mood: "wonder", struggle: "shame", entryType: "K", metaphor: "room" },
  { dayNumber: 34, title: "The Mind That Meets Doubt", scripture: "John 20:24-29", scene: "Thomas demands proof. Christ provides it without rebuke.", masterMindInsight: "Christ meets doubt with evidence, not anger — honest questioning receives honest answers.", mood: "intimate", struggle: "doubt", entryType: "E", metaphor: "light" },
  { dayNumber: 35, title: "The Mind That Cooks Breakfast", scripture: "John 21:1-14", scene: "Charcoal fire. Fish grilling. 'Come and eat.'", masterMindInsight: "The Risen King makes breakfast — glory serves in ordinary ways.", mood: "wonder", struggle: "burnout", entryType: "L", metaphor: "room" },

  // Week 6: Appearances & Legacy (Days 36-40)
  { dayNumber: 36, title: "The Mind That Restores Peter", scripture: "John 21:15-19", scene: "Three questions. Three answers. 'Feed my sheep.'", masterMindInsight: "Christ restores by revisiting the wound — three denials answered with three commissions.", mood: "intimate", struggle: "guilt", entryType: "A", metaphor: "water" },
  { dayNumber: 37, title: "The Mind That Opens Scripture", scripture: "Luke 24:13-35", scene: "A road. Two travelers. Hearts burning.", masterMindInsight: "The Master Mind walks alongside before revealing — He teaches through presence, not lecture.", mood: "wonder", struggle: "despair", entryType: "D", metaphor: "walk" },
  { dayNumber: 38, title: "The Mind That Commissions", scripture: "Matthew 28:16-20", scene: "'All authority is given to me. Go.'", masterMindInsight: "Christ sends from His authority, not yours — 'go' is backed by 'I am with you always.'", mood: "triumph", struggle: "fear", entryType: "G", metaphor: "light" },
  { dayNumber: 39, title: "The Mind That Ascends", scripture: "Acts 1:6-11", scene: "Lifted up. A cloud. 'He will come back.'", masterMindInsight: "The Master Mind departs to expand — absence creates space for global presence through the Spirit.", mood: "awe", struggle: "loneliness", entryType: "F", metaphor: "light" },
  { dayNumber: 40, title: "The Mind That Lives in You", scripture: "Philippians 2:5-11; Acts 2:1-4", scene: "Wind. Fire. Languages. The Mind descends on many.", masterMindInsight: "The Master Mind is no longer outside you — Pentecost means Christ's thinking is now your inheritance.", mood: "glory", struggle: "doubt", entryType: "L", metaphor: "room" },
];

// ═══════════════════════════════════════════════════════════════════
// 40-DAY TRACT METADATA (abbreviated tracts — sessions generated on demand)
// ═══════════════════════════════════════════════════════════════════

const MOSES_WEEKS: WeekOverview[] = [
  { week: 1, title: "The Hidden Years", theme: "Hidden preparation", scriptureRange: "Exodus 1-2" },
  { week: 2, title: "The Burning Bush", theme: "God's call and Moses' resistance", scriptureRange: "Exodus 3-4" },
  { week: 3, title: "Confronting Pharaoh", theme: "Speaking truth to power", scriptureRange: "Exodus 5-11" },
  { week: 4, title: "The Red Sea", theme: "Impossible deliverance", scriptureRange: "Exodus 12-15" },
  { week: 5, title: "The Wilderness", theme: "Testing and provision", scriptureRange: "Exodus 16-18" },
  { week: 6, title: "Sinai", theme: "Encountering God face to face", scriptureRange: "Exodus 19-34" },
];

const ELIJAH_WEEKS: WeekOverview[] = [
  { week: 1, title: "The Tishbite Appears", theme: "Boldness from obscurity", scriptureRange: "1 Kings 17:1-7" },
  { week: 2, title: "Widow's House", theme: "Provision in famine", scriptureRange: "1 Kings 17:8-24" },
  { week: 3, title: "Mount Carmel", theme: "Confrontation and fire", scriptureRange: "1 Kings 18" },
  { week: 4, title: "The Cave", theme: "Depression after victory", scriptureRange: "1 Kings 19:1-18" },
  { week: 5, title: "Naboth's Vineyard", theme: "Prophetic justice", scriptureRange: "1 Kings 21" },
  { week: 6, title: "The Chariot of Fire", theme: "Passing the mantle", scriptureRange: "2 Kings 2:1-14" },
];

const DAVID_WEEKS: WeekOverview[] = [
  { week: 1, title: "The Shepherd Boy", theme: "Faithfulness in obscurity", scriptureRange: "1 Samuel 16-17" },
  { week: 2, title: "Running from Saul", theme: "Trusting God under pursuit", scriptureRange: "1 Samuel 18-24" },
  { week: 3, title: "The Cave of Adullam", theme: "Leading the broken", scriptureRange: "1 Samuel 22; Psalms 34, 57" },
  { week: 4, title: "King David", theme: "Authority and worship", scriptureRange: "2 Samuel 5-7" },
  { week: 5, title: "The Fall", theme: "Sin, confession, restoration", scriptureRange: "2 Samuel 11-12; Psalm 51" },
  { week: 6, title: "The Last Words", theme: "Legacy and the eternal throne", scriptureRange: "2 Samuel 23; 1 Kings 2" },
];

const JOSEPH_WEEKS: WeekOverview[] = [
  { week: 1, title: "The Dreamer", theme: "Vision before vindication", scriptureRange: "Genesis 37" },
  { week: 2, title: "The Pit and the Price", theme: "Betrayal and being sold", scriptureRange: "Genesis 37:18-36" },
  { week: 3, title: "Potiphar's House", theme: "Integrity under temptation", scriptureRange: "Genesis 39" },
  { week: 4, title: "The Prison", theme: "Faithfulness in forgotten places", scriptureRange: "Genesis 39:20-40:23" },
  { week: 5, title: "Before Pharaoh", theme: "God's timing and elevation", scriptureRange: "Genesis 41" },
  { week: 6, title: "The Reunion", theme: "Forgiveness and 'God meant it for good'", scriptureRange: "Genesis 42-50" },
];

const DANIEL_WEEKS: WeekOverview[] = [
  { week: 1, title: "The Captive Who Decided", theme: "Convictions in a foreign land", scriptureRange: "Daniel 1" },
  { week: 2, title: "The Dream Interpreter", theme: "Wisdom from God alone", scriptureRange: "Daniel 2" },
  { week: 3, title: "The Furnace", theme: "Faithfulness under fire", scriptureRange: "Daniel 3" },
  { week: 4, title: "The Lion's Den", theme: "Prayer as defiance", scriptureRange: "Daniel 6" },
  { week: 5, title: "The Visions", theme: "Seeing beyond the present age", scriptureRange: "Daniel 7-9" },
  { week: 6, title: "The Man of Prayer", theme: "Persistence in intercession", scriptureRange: "Daniel 10-12" },
];

const ABRAHAM_WEEKS: WeekOverview[] = [
  { week: 1, title: "The Call", theme: "Leaving everything on a promise", scriptureRange: "Genesis 12" },
  { week: 2, title: "The Covenant", theme: "God's unbreakable word", scriptureRange: "Genesis 15" },
  { week: 3, title: "Ishmael", theme: "Running ahead of God", scriptureRange: "Genesis 16" },
  { week: 4, title: "Three Visitors", theme: "Hospitality and impossible promises", scriptureRange: "Genesis 18" },
  { week: 5, title: "Mount Moriah", theme: "The ultimate surrender", scriptureRange: "Genesis 22" },
  { week: 6, title: "The Father of Faith", theme: "Legacy and inheritance", scriptureRange: "Hebrews 11:8-19" },
];

const WOMEN_WEEKS: WeekOverview[] = [
  { week: 1, title: "Eve & Sarah", theme: "Origins and promise", scriptureRange: "Genesis 2-3; 18; 21" },
  { week: 2, title: "Ruth & Naomi", theme: "Loyalty and redemption", scriptureRange: "Ruth 1-4" },
  { week: 3, title: "Hannah & Deborah", theme: "Prayer and leadership", scriptureRange: "Judges 4-5; 1 Samuel 1-2" },
  { week: 4, title: "Esther", theme: "Courage for such a time", scriptureRange: "Esther 1-10" },
  { week: 5, title: "Mary of Nazareth", theme: "Surrender and magnificat", scriptureRange: "Luke 1-2" },
  { week: 6, title: "Mary Magdalene & the Women at the Tomb", theme: "First witnesses of resurrection", scriptureRange: "John 20; Luke 24" },
];

const RIGHTEOUS_DEAD_WEEKS: WeekOverview[] = [
  { week: 1, title: "Abel to Enoch", theme: "First blood, first translation", scriptureRange: "Genesis 4-5; Hebrews 11:4-5" },
  { week: 2, title: "Noah to Job", theme: "Righteousness in devastation", scriptureRange: "Genesis 6-9; Job 1-42" },
  { week: 3, title: "Samuel to Josiah", theme: "Prophetic voices, reforming kings", scriptureRange: "1 Samuel 3; 2 Kings 22-23" },
  { week: 4, title: "Isaiah to Jeremiah", theme: "Speaking God's word at great cost", scriptureRange: "Isaiah 6; 53; Jeremiah 1; 20" },
  { week: 5, title: "John the Baptist", theme: "The voice in the wilderness", scriptureRange: "Matthew 3; 11; 14" },
  { week: 6, title: "Stephen to Paul", theme: "Martyrdom and mission", scriptureRange: "Acts 7; Philippians 1:21" },
];

const ACTS_WEEKS: WeekOverview[] = [
  { week: 1, title: "Pentecost", theme: "The Spirit descends", scriptureRange: "Acts 1-2" },
  { week: 2, title: "The Early Church", theme: "Community and power", scriptureRange: "Acts 3-5" },
  { week: 3, title: "Scattering", theme: "Persecution spreads the gospel", scriptureRange: "Acts 6-8" },
  { week: 4, title: "Paul's Conversion", theme: "Enemy becomes apostle", scriptureRange: "Acts 9-12" },
  { week: 5, title: "The Missionary Journeys", theme: "Taking Christ to the nations", scriptureRange: "Acts 13-20" },
  { week: 6, title: "Chains and Rome", theme: "Triumph in imprisonment", scriptureRange: "Acts 21-28" },
];

const PARABLES_WEEKS: WeekOverview[] = [
  { week: 1, title: "The Sower", theme: "How truth takes root", scriptureRange: "Matthew 13:1-23" },
  { week: 2, title: "The Prodigal Son", theme: "The Father's heart", scriptureRange: "Luke 15" },
  { week: 3, title: "The Good Samaritan", theme: "Radical neighbor-love", scriptureRange: "Luke 10:25-37" },
  { week: 4, title: "The Talents", theme: "Stewardship and accountability", scriptureRange: "Matthew 25:14-30" },
  { week: 5, title: "The Ten Virgins", theme: "Readiness and watchfulness", scriptureRange: "Matthew 25:1-13" },
  { week: 6, title: "The Sheep and Goats", theme: "Final judgment and mercy", scriptureRange: "Matthew 25:31-46" },
];

const REVELATION_WEEKS: WeekOverview[] = [
  { week: 1, title: "The Son of Man", theme: "Christ revealed in glory", scriptureRange: "Revelation 1" },
  { week: 2, title: "Letters to the Churches", theme: "Commendation and correction", scriptureRange: "Revelation 2-3" },
  { week: 3, title: "The Throne Room", theme: "Worship around the Lamb", scriptureRange: "Revelation 4-5" },
  { week: 4, title: "The Seals and Trumpets", theme: "Judgment and mercy", scriptureRange: "Revelation 6-11" },
  { week: 5, title: "The Woman and the Dragon", theme: "Cosmic spiritual war", scriptureRange: "Revelation 12-18" },
  { week: 6, title: "The New Jerusalem", theme: "All things made new", scriptureRange: "Revelation 19-22" },
];

// ═══════════════════════════════════════════════════════════════════
// 365-DAY TRACT SERIES BLOCKS (sessions generated on demand by Jeeves)
// ═══════════════════════════════════════════════════════════════════

const CHRONOLOGICAL_365_BLOCKS: SeriesBlock[] = [
  { name: "Creation & Eden", dayRange: [1, 10], sessions: 10, scriptureScope: "Genesis 1-3", throughline: "The Master Mind brings order from chaos." },
  { name: "The Fall & First Family", dayRange: [11, 20], sessions: 10, scriptureScope: "Genesis 3-5", throughline: "Sin fractures but doesn't destroy the image." },
  { name: "Noah & the Flood", dayRange: [21, 30], sessions: 10, scriptureScope: "Genesis 6-9", throughline: "Judgment and mercy in the same act." },
  { name: "Babel to Abraham", dayRange: [31, 42], sessions: 12, scriptureScope: "Genesis 10-12", throughline: "God scatters to regather through one family." },
  { name: "Abraham's Journey", dayRange: [43, 55], sessions: 13, scriptureScope: "Genesis 12-25", throughline: "Faith is trusting the unseen promise." },
  { name: "Isaac & Jacob", dayRange: [56, 68], sessions: 13, scriptureScope: "Genesis 25-36", throughline: "God works through the imperfect." },
  { name: "Joseph", dayRange: [69, 82], sessions: 14, scriptureScope: "Genesis 37-50", throughline: "What you meant for evil, God meant for good." },
  { name: "Exodus: Bondage to Deliverance", dayRange: [83, 96], sessions: 14, scriptureScope: "Exodus 1-15", throughline: "God hears the cry and moves." },
  { name: "Wilderness Wandering", dayRange: [97, 110], sessions: 14, scriptureScope: "Exodus 16-Numbers 14", throughline: "Testing reveals what's truly inside." },
  { name: "Law & Tabernacle", dayRange: [111, 120], sessions: 10, scriptureScope: "Exodus 20-40", throughline: "God dwells among His people." },
  { name: "Conquest", dayRange: [121, 132], sessions: 12, scriptureScope: "Joshua 1-24", throughline: "Courage to possess what's promised." },
  { name: "Judges Cycle", dayRange: [133, 145], sessions: 13, scriptureScope: "Judges", throughline: "The cycle of rebellion and rescue." },
  { name: "Ruth & Samuel", dayRange: [146, 155], sessions: 10, scriptureScope: "Ruth; 1 Samuel 1-8", throughline: "Faithfulness in small things leads to great things." },
  { name: "David's Rise", dayRange: [156, 168], sessions: 13, scriptureScope: "1 Samuel 9-31", throughline: "God's anointing precedes human timing." },
  { name: "David's Reign", dayRange: [169, 180], sessions: 12, scriptureScope: "2 Samuel; Psalms", throughline: "Worship and war in the same heart." },
  { name: "Solomon & Wisdom", dayRange: [181, 192], sessions: 12, scriptureScope: "1 Kings 1-11; Proverbs; Ecclesiastes", throughline: "Wisdom without obedience still leads astray." },
  { name: "Divided Kingdom", dayRange: [193, 205], sessions: 13, scriptureScope: "1 Kings 12-2 Kings 17", throughline: "Division is the fruit of unfaithfulness." },
  { name: "Prophets: Elijah & Elisha", dayRange: [206, 218], sessions: 13, scriptureScope: "1 Kings 17-2 Kings 13", throughline: "The prophetic voice calls home." },
  { name: "Writing Prophets I", dayRange: [219, 230], sessions: 12, scriptureScope: "Isaiah; Jeremiah; Lamentations", throughline: "God speaks before He acts." },
  { name: "Writing Prophets II", dayRange: [231, 242], sessions: 12, scriptureScope: "Ezekiel; Daniel; Minor Prophets", throughline: "Vision sustains in exile." },
  { name: "Exile & Return", dayRange: [243, 255], sessions: 13, scriptureScope: "Ezra; Nehemiah; Esther", throughline: "God restores what sin destroyed." },
  { name: "Between the Testaments", dayRange: [256, 262], sessions: 7, scriptureScope: "Malachi; Intertestamental context", throughline: "Silence is not absence." },
  { name: "Birth & Early Life of Christ", dayRange: [263, 275], sessions: 13, scriptureScope: "Matthew 1-4; Luke 1-4", throughline: "God enters what He made." },
  { name: "Galilean Ministry", dayRange: [276, 290], sessions: 15, scriptureScope: "Matthew 5-18; Mark 1-9; Luke 5-9", throughline: "The Kingdom is here and it's upside down." },
  { name: "Parables & Teachings", dayRange: [291, 302], sessions: 12, scriptureScope: "Matthew 13; Luke 10-18", throughline: "Stories that rearrange the soul." },
  { name: "Miracles & Signs", dayRange: [303, 314], sessions: 12, scriptureScope: "John 2-11; Mark; Luke", throughline: "Power with purpose." },
  { name: "Road to Jerusalem", dayRange: [315, 325], sessions: 11, scriptureScope: "Luke 9-19; John 7-11", throughline: "Everything moves toward the cross." },
  { name: "Passion Week", dayRange: [326, 340], sessions: 15, scriptureScope: "Matthew 21-28; John 12-21", throughline: "The mind that surrenders to win." },
  { name: "Resurrection Appearances", dayRange: [341, 350], sessions: 10, scriptureScope: "Matthew 28; John 20-21; Acts 1", throughline: "Death has lost its grip." },
  { name: "Birth of the Church", dayRange: [351, 358], sessions: 8, scriptureScope: "Acts 1-12", throughline: "The Spirit continues what the Son started." },
  { name: "Paul's Mission", dayRange: [359, 363], sessions: 5, scriptureScope: "Acts 13-28; Epistles", throughline: "Grace reaches the ends of the earth." },
  { name: "Revelation & New Creation", dayRange: [364, 365], sessions: 2, scriptureScope: "Revelation 21-22", throughline: "All things made new." },
];

const THEMATIC_365_BLOCKS: SeriesBlock[] = [
  { name: "The Mind of God", dayRange: [1, 15], sessions: 15, scriptureScope: "Genesis 1; Isaiah 55; Romans 11", throughline: "How God thinks — and why it matters." },
  { name: "The Mind of Christ", dayRange: [16, 30], sessions: 15, scriptureScope: "Philippians 2; John 5-8", throughline: "What it means to think as Christ thinks." },
  { name: "Identity in Christ", dayRange: [31, 45], sessions: 15, scriptureScope: "Ephesians 1-3; Galatians 2:20", throughline: "You are who He says you are." },
  { name: "Faith & Trust", dayRange: [46, 60], sessions: 15, scriptureScope: "Hebrews 11; Romans 4", throughline: "Trusting what you cannot see." },
  { name: "Prayer & Communion", dayRange: [61, 75], sessions: 15, scriptureScope: "Matthew 6; Psalms; John 17", throughline: "Conversation with the Infinite." },
  { name: "Suffering & Endurance", dayRange: [76, 90], sessions: 15, scriptureScope: "Job; Romans 5:3-5; 2 Corinthians 4", throughline: "Pain has a curriculum." },
  { name: "Forgiveness & Mercy", dayRange: [91, 105], sessions: 15, scriptureScope: "Matthew 18; Luke 15; Colossians 3:13", throughline: "Mercy given is mercy received." },
  { name: "Warfare & Spiritual Battle", dayRange: [106, 120], sessions: 15, scriptureScope: "Ephesians 6; Daniel 10; 2 Corinthians 10", throughline: "The battle is real but already won." },
  { name: "Love & Relationships", dayRange: [121, 135], sessions: 15, scriptureScope: "1 Corinthians 13; John 13-15; Song of Solomon", throughline: "Love is the operating system of the Kingdom." },
  { name: "Holiness & Purity", dayRange: [136, 150], sessions: 15, scriptureScope: "Leviticus; Psalm 51; 1 Peter 1:15-16", throughline: "Set apart, not set aside." },
  { name: "Wisdom & Discernment", dayRange: [151, 165], sessions: 15, scriptureScope: "Proverbs; James; 1 Kings 3", throughline: "See as God sees." },
  { name: "Kingdom Living", dayRange: [166, 180], sessions: 15, scriptureScope: "Matthew 5-7; Luke 6", throughline: "The upside-down kingdom where last is first." },
  { name: "Stewardship & Work", dayRange: [181, 195], sessions: 15, scriptureScope: "Genesis 2:15; Matthew 25:14-30; Colossians 3:23", throughline: "Work as worship." },
  { name: "Justice & Compassion", dayRange: [196, 210], sessions: 15, scriptureScope: "Micah 6:8; Isaiah 58; Matthew 25:31-46", throughline: "Mercy and justice walk together." },
  { name: "Rest & Sabbath", dayRange: [211, 225], sessions: 15, scriptureScope: "Genesis 2:1-3; Hebrews 4; Psalm 23", throughline: "Rest is not lazy — it's the crown of work." },
  { name: "Hope & Future", dayRange: [226, 240], sessions: 15, scriptureScope: "Romans 8:18-39; Revelation 21-22", throughline: "The best is always ahead." },
  { name: "The Word of God", dayRange: [241, 255], sessions: 15, scriptureScope: "Psalm 119; Hebrews 4:12; John 1", throughline: "The living, active Word." },
  { name: "The Spirit-Led Life", dayRange: [256, 270], sessions: 15, scriptureScope: "John 14-16; Galatians 5; Romans 8", throughline: "Walk by the Spirit." },
  { name: "Worship & Adoration", dayRange: [271, 285], sessions: 15, scriptureScope: "Psalms; Revelation 4-5; John 4:23-24", throughline: "You become what you behold." },
  { name: "Community & Church", dayRange: [286, 300], sessions: 15, scriptureScope: "Acts 2:42-47; 1 Corinthians 12; Ephesians 4", throughline: "We are not alone in this." },
  { name: "Evangelism & Mission", dayRange: [301, 315], sessions: 15, scriptureScope: "Matthew 28:18-20; Acts; Romans 10", throughline: "The message must go out." },
  { name: "Death & Resurrection", dayRange: [316, 330], sessions: 15, scriptureScope: "1 Corinthians 15; John 11; Revelation 20", throughline: "Death is a door, not a wall." },
  { name: "The Names of God", dayRange: [331, 345], sessions: 15, scriptureScope: "Exodus 3:14; Psalm 23; John 6-15 I AM statements", throughline: "His name reveals His nature." },
  { name: "The Return of Christ", dayRange: [346, 365], sessions: 20, scriptureScope: "Matthew 24-25; 1 Thessalonians 4; Revelation 19-22", throughline: "He is coming back — and everything changes." },
];

const CHARACTER_365_BLOCKS: SeriesBlock[] = [
  { name: "Adam & Eve", dayRange: [1, 14], sessions: 14, scriptureScope: "Genesis 1-4", throughline: "The first image-bearers." },
  { name: "Noah", dayRange: [15, 24], sessions: 10, scriptureScope: "Genesis 6-9", throughline: "Obedience when no one else obeys." },
  { name: "Abraham", dayRange: [25, 42], sessions: 18, scriptureScope: "Genesis 12-25", throughline: "The father of faith." },
  { name: "Isaac", dayRange: [43, 50], sessions: 8, scriptureScope: "Genesis 21-28", throughline: "The quiet son of promise." },
  { name: "Jacob", dayRange: [51, 64], sessions: 14, scriptureScope: "Genesis 25-36", throughline: "The wrestler who became Israel." },
  { name: "Joseph", dayRange: [65, 82], sessions: 18, scriptureScope: "Genesis 37-50", throughline: "Suffering that saves nations." },
  { name: "Moses", dayRange: [83, 110], sessions: 28, scriptureScope: "Exodus-Deuteronomy", throughline: "The deliverer who knew God face to face." },
  { name: "Joshua", dayRange: [111, 122], sessions: 12, scriptureScope: "Joshua", throughline: "Courage to possess the promise." },
  { name: "Gideon & Samson", dayRange: [123, 134], sessions: 12, scriptureScope: "Judges 6-8; 13-16", throughline: "Strength and weakness in God's hands." },
  { name: "Ruth & Hannah", dayRange: [135, 146], sessions: 12, scriptureScope: "Ruth; 1 Samuel 1-2", throughline: "Faithful women who changed history." },
  { name: "Samuel", dayRange: [147, 158], sessions: 12, scriptureScope: "1 Samuel 1-16", throughline: "Hearing the voice of God." },
  { name: "David", dayRange: [159, 186], sessions: 28, scriptureScope: "1 Samuel 16-1 Kings 2; Psalms", throughline: "A man after God's own heart." },
  { name: "Solomon", dayRange: [187, 198], sessions: 12, scriptureScope: "1 Kings 1-11; Proverbs; Ecclesiastes", throughline: "Wisdom gained and lost." },
  { name: "Elijah & Elisha", dayRange: [199, 216], sessions: 18, scriptureScope: "1 Kings 17-2 Kings 13", throughline: "Fire and double portion." },
  { name: "Isaiah", dayRange: [217, 228], sessions: 12, scriptureScope: "Isaiah", throughline: "The prophet who saw the throne." },
  { name: "Jeremiah", dayRange: [229, 240], sessions: 12, scriptureScope: "Jeremiah; Lamentations", throughline: "The weeping prophet." },
  { name: "Daniel", dayRange: [241, 254], sessions: 14, scriptureScope: "Daniel", throughline: "Faithfulness in exile." },
  { name: "Esther", dayRange: [255, 264], sessions: 10, scriptureScope: "Esther", throughline: "For such a time as this." },
  { name: "Nehemiah & Ezra", dayRange: [265, 276], sessions: 12, scriptureScope: "Nehemiah; Ezra", throughline: "Rebuilding what was destroyed." },
  { name: "John the Baptist", dayRange: [277, 286], sessions: 10, scriptureScope: "Matthew 3; Luke 1; John 1", throughline: "The voice crying in the wilderness." },
  { name: "Mary, Mother of Jesus", dayRange: [287, 296], sessions: 10, scriptureScope: "Luke 1-2; John 2; 19", throughline: "The handmaid of the Lord." },
  { name: "Peter", dayRange: [297, 312], sessions: 16, scriptureScope: "Gospels; Acts 1-12; 1-2 Peter", throughline: "The rock who stumbled and stood." },
  { name: "Paul", dayRange: [313, 336], sessions: 24, scriptureScope: "Acts 9-28; Epistles", throughline: "Grace transforms the persecutor." },
  { name: "Jesus: Early Life", dayRange: [337, 346], sessions: 10, scriptureScope: "Matthew 1-4; Luke 1-4; John 1", throughline: "God among us." },
  { name: "Jesus: Ministry", dayRange: [347, 358], sessions: 12, scriptureScope: "Gospels (ministry years)", throughline: "The Kingdom is at hand." },
  { name: "Jesus: Passion & Glory", dayRange: [359, 365], sessions: 7, scriptureScope: "Passion narratives; Revelation 1", throughline: "The Lamb who is the Lion." },
];

// ═══════════════════════════════════════════════════════════════════
// TRACT CATALOG
// ═══════════════════════════════════════════════════════════════════

export const WATCH_TRACTS: WatchTract[] = [
  // ── 7-Day Free Starter ──
  {
    id: "creation-7",
    name: "Creation",
    subtitle: "The Mind That Creates",
    type: "free",
    totalSessions: 7,
    description: "Experience how the Master Mind brings order from chaos — each day reveals another dimension of how Christ thinks.",
    throughline: "The Master Mind brings order from chaos — each day reveals another dimension of how.",
    icon: "✨",
    sessions: CREATION_NIGHT,
    mornings: CREATION_MORNING,
    isFree: true,
  },

  // ── 40-Day Tracts ──
  {
    id: "passion-40",
    name: "The Passion",
    subtitle: "The Mind That Surrenders to Win",
    type: "40-day",
    totalSessions: 40,
    description: "Walk with Christ from the Upper Room through the Cross to the empty tomb. 40 days of seeing how the Master Mind thinks through the most intense week in history.",
    throughline: "The mind that surrenders to win — from Upper Room to empty tomb.",
    icon: "✝️",
    sessions: PASSION_NIGHT,
    isFree: true,
  },
  {
    id: "moses-40",
    name: "Moses",
    subtitle: "The Mind That Delivers",
    type: "40-day",
    totalSessions: 40,
    description: "From the Nile to Sinai — 40 days tracing the mind that confronts, delivers, and leads an entire nation out of bondage.",
    throughline: "The mind that delivers a nation — from slavery to Sinai.",
    icon: "🔥",
    sessions: [],
    weekOverviews: MOSES_WEEKS,
  },
  {
    id: "elijah-40",
    name: "Elijah",
    subtitle: "The Mind That Confronts",
    type: "40-day",
    totalSessions: 40,
    description: "From the brook to the chariot — 40 days in the mind that stands alone, calls fire, and passes the mantle.",
    throughline: "The mind that stands alone against a culture — from brook to chariot.",
    icon: "⚡",
    sessions: [],
    weekOverviews: ELIJAH_WEEKS,
  },
  {
    id: "david-40",
    name: "David",
    subtitle: "The Mind That Worships Through War",
    type: "40-day",
    totalSessions: 40,
    description: "Shepherd, fugitive, king, worshiper — 40 days tracing the mind after God's own heart.",
    throughline: "A man after God's own heart — from the fields to the throne.",
    icon: "👑",
    sessions: [],
    weekOverviews: DAVID_WEEKS,
  },
  {
    id: "joseph-40",
    name: "Joseph",
    subtitle: "The Mind That Trusts the Process",
    type: "40-day",
    totalSessions: 40,
    description: "From pit to palace — 40 days in the mind that interprets suffering as sovereignty.",
    throughline: "What you meant for evil, God meant for good.",
    icon: "🌾",
    sessions: [],
    weekOverviews: JOSEPH_WEEKS,
  },
  {
    id: "daniel-40",
    name: "Daniel",
    subtitle: "The Mind That Won't Bow",
    type: "40-day",
    totalSessions: 40,
    description: "Captive, interpreter, lion-tamer — 40 days in the mind that refuses to compromise in a foreign land.",
    throughline: "Faithfulness in exile — the mind that won't bow.",
    icon: "🦁",
    sessions: [],
    weekOverviews: DANIEL_WEEKS,
  },
  {
    id: "abraham-40",
    name: "Abraham",
    subtitle: "The Mind That Leaves to Find",
    type: "40-day",
    totalSessions: 40,
    description: "From Ur to Moriah — 40 days tracing the mind that follows a voice into the unknown.",
    throughline: "Leave everything, gain everything — the father of faith.",
    icon: "⭐",
    sessions: [],
    weekOverviews: ABRAHAM_WEEKS,
  },
  {
    id: "women-40",
    name: "Women of Scripture",
    subtitle: "The Mind That Overcomes",
    type: "40-day",
    totalSessions: 40,
    description: "Eve, Ruth, Esther, Mary, and more — 40 days in the minds of women who shaped salvation history.",
    throughline: "Women who changed everything — from Eve to the empty tomb.",
    icon: "💎",
    sessions: [],
    weekOverviews: WOMEN_WEEKS,
  },
  {
    id: "righteous-dead-40",
    name: "The Righteous Dead",
    subtitle: "The Mind That Finishes Well",
    type: "40-day",
    totalSessions: 40,
    description: "Abel to Stephen — 40 days meditating on those who kept the faith to the very end.",
    throughline: "They finished the race — will you?",
    icon: "🕊️",
    sessions: [],
    weekOverviews: RIGHTEOUS_DEAD_WEEKS,
  },
  {
    id: "acts-40",
    name: "Acts of the Spirit",
    subtitle: "The Mind That Spreads Like Fire",
    type: "40-day",
    totalSessions: 40,
    description: "From Pentecost to Rome — 40 days in the mind of the early church that turned the world upside down.",
    throughline: "The Spirit continues what the Son started.",
    icon: "🔥",
    sessions: [],
    weekOverviews: ACTS_WEEKS,
  },
  {
    id: "parables-40",
    name: "Parables of Jesus",
    subtitle: "The Mind That Teaches in Stories",
    type: "40-day",
    totalSessions: 40,
    description: "Sower, Samaritan, Prodigal — 40 days inside the stories that rearrange the soul.",
    throughline: "Stories that rearrange how you see everything.",
    icon: "📖",
    sessions: [],
    weekOverviews: PARABLES_WEEKS,
  },
  {
    id: "revelation-40",
    name: "Revelation",
    subtitle: "The Mind That Reigns",
    type: "40-day",
    totalSessions: 40,
    description: "From the seven churches to the new creation — 40 days beholding the Lamb who is the Lion.",
    throughline: "The Lamb who was slain now reigns.",
    icon: "🌟",
    sessions: [],
    weekOverviews: REVELATION_WEEKS,
  },

  // ── 365-Day Journeys ──
  {
    id: "chronological-365",
    name: "The Whole Story",
    subtitle: "Chronological Bible Journey",
    type: "365-day",
    totalSessions: 365,
    description: "Walk through the entire Bible from Genesis to Revelation in chronological order. One year. Every major scene. The Master Mind revealed across all of Scripture.",
    throughline: "The whole story, one night at a time.",
    icon: "📜",
    sessions: [],
    seriesBlocks: CHRONOLOGICAL_365_BLOCKS,
  },
  {
    id: "thematic-365",
    name: "Themes of the Mind",
    subtitle: "Thematic Bible Journey",
    type: "365-day",
    totalSessions: 365,
    description: "365 days organized around 24 themes — identity, faith, suffering, prayer, worship, and more. Each theme explored for 15 days.",
    throughline: "Every theme of Scripture, explored deeply.",
    icon: "🧠",
    sessions: [],
    seriesBlocks: THEMATIC_365_BLOCKS,
  },
  {
    id: "character-365",
    name: "Lives That Speak",
    subtitle: "Character-Driven Bible Journey",
    type: "365-day",
    totalSessions: 365,
    description: "365 days walking in the footsteps of 26 biblical characters — from Adam to Jesus. See the Master Mind at work in every life.",
    throughline: "26 lives, one year, the same Master Mind in all.",
    icon: "👤",
    sessions: [],
    seriesBlocks: CHARACTER_365_BLOCKS,
  },
];

// ── Helper Functions ──

export function getTractById(id: string): WatchTract | undefined {
  return WATCH_TRACTS.find((t) => t.id === id);
}

export function getFreeTracts(): WatchTract[] {
  return WATCH_TRACTS.filter((t) => t.isFree);
}

export function getTractsByType(type: WatchTract["type"]): WatchTract[] {
  return WATCH_TRACTS.filter((t) => t.type === type);
}

export function getSessionForDay(tract: WatchTract, day: number): WatchSession | undefined {
  return tract.sessions.find((s) => s.dayNumber === day);
}

export function getBlockForDay(tract: WatchTract, day: number): SeriesBlock | undefined {
  return tract.seriesBlocks?.find((b) => day >= b.dayRange[0] && day <= b.dayRange[1]);
}
