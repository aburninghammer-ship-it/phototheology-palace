import { useState, useEffect, useCallback } from "react";
import { FloatingGameChat } from "@/components/games/FloatingGameChat";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { GameLeaderboard } from "@/components/GameLeaderboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, ArrowLeft, CheckCircle, XCircle, Library, Gamepad2, Timer, Zap, Brain, BookOpen, HelpCircle, RotateCcw, Star, Flame, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { StoryLibrary } from "@/components/story-room/StoryLibrary";

// Difficulty settings
type Difficulty = "easy" | "medium" | "hard" | "expert";

interface DifficultySettings {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  maxScenes: number;
  timeLimit: number | null; // seconds, null = no limit
  hintsAllowed: number;
  pointsMultiplier: number;
  showBookReference: boolean;
}

const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    name: "Easy",
    description: "Fewer scenes, hints available, no time limit",
    icon: <Star className="h-5 w-5" />,
    color: "bg-green-500",
    maxScenes: 4,
    timeLimit: null,
    hintsAllowed: 3,
    pointsMultiplier: 1,
    showBookReference: true,
  },
  medium: {
    name: "Medium",
    description: "Standard scenes, limited hints, relaxed timing",
    icon: <Flame className="h-5 w-5" />,
    color: "bg-yellow-500",
    maxScenes: 5,
    timeLimit: 120,
    hintsAllowed: 2,
    pointsMultiplier: 1.5,
    showBookReference: true,
  },
  hard: {
    name: "Hard",
    description: "All scenes, one hint, time pressure",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-orange-500",
    maxScenes: 6,
    timeLimit: 60,
    hintsAllowed: 1,
    pointsMultiplier: 2,
    showBookReference: false,
  },
  expert: {
    name: "Expert",
    description: "All scenes, no hints, strict timing",
    icon: <Trophy className="h-5 w-5" />,
    color: "bg-red-500",
    maxScenes: 8,
    timeLimit: 45,
    hintsAllowed: 0,
    pointsMultiplier: 3,
    showBookReference: false,
  },
};

// Challenge types
type ChallengeType = "sequence" | "identify" | "missing" | "character" | "book";

interface ChallengeTypeInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
}

const CHALLENGE_TYPES: Record<ChallengeType, ChallengeTypeInfo> = {
  sequence: {
    name: "Sequence Order",
    description: "Arrange scenes in chronological order",
    icon: <Target className="h-4 w-4" />,
  },
  identify: {
    name: "Story Identification",
    description: "Identify the story from its scenes",
    icon: <BookOpen className="h-4 w-4" />,
  },
  missing: {
    name: "Missing Scene",
    description: "Fill in the missing scene",
    icon: <HelpCircle className="h-4 w-4" />,
  },
  character: {
    name: "Character Match",
    description: "Match characters to their stories",
    icon: <Brain className="h-4 w-4" />,
  },
  book: {
    name: "Book Reference",
    description: "Identify the book of the Bible",
    icon: <Library className="h-4 w-4" />,
  },
};

// Story data with characters for additional challenge types
interface StoryQuiz {
  story: string;
  sequence: string[];
  correct: string[];
  book: string;
  characters?: string[];
  category?: string;
}

const storyQuizzes: StoryQuiz[] = [
  // === CLASSIC STORIES ===
  {
    story: "Joseph's Journey",
    sequence: ["Coat of Many Colors", "Thrown in Pit", "Sold to Caravan", "Prison", "Pharaoh's Palace"],
    correct: ["Coat of Many Colors", "Thrown in Pit", "Sold to Caravan", "Prison", "Pharaoh's Palace"],
    book: "Genesis 37-50",
    characters: ["Joseph", "Jacob", "Pharaoh", "Potiphar"],
    category: "Patriarchs"
  },
  {
    story: "David and Goliath",
    sequence: ["Sling in Motion", "Stone in Flight", "Giant Falling", "Sword Raised"],
    correct: ["Sling in Motion", "Stone in Flight", "Giant Falling", "Sword Raised"],
    book: "1 Samuel 17",
    characters: ["David", "Goliath", "Saul", "Jesse"],
    category: "Kings"
  },
  {
    story: "Daniel's Trial",
    sequence: ["Refuses King's Table", "Fiery Furnace", "Lions' Den", "Vision of Beasts"],
    correct: ["Refuses King's Table", "Fiery Furnace", "Lions' Den", "Vision of Beasts"],
    book: "Daniel 1-7",
    characters: ["Daniel", "Nebuchadnezzar", "Shadrach", "Meshach", "Abednego"],
    category: "Prophets"
  },
  {
    story: "Exodus Journey",
    sequence: ["Burning Bush", "Ten Plagues", "Red Sea Crossing", "Mount Sinai", "Golden Calf", "Tabernacle Built"],
    correct: ["Burning Bush", "Ten Plagues", "Red Sea Crossing", "Mount Sinai", "Golden Calf", "Tabernacle Built"],
    book: "Exodus 3-40",
    characters: ["Moses", "Aaron", "Pharaoh", "Miriam"],
    category: "Exodus"
  },
  {
    story: "Christ's Passion",
    sequence: ["Last Supper", "Gethsemane", "Trial", "Crucifixion", "Burial", "Resurrection"],
    correct: ["Last Supper", "Gethsemane", "Trial", "Crucifixion", "Burial", "Resurrection"],
    book: "Matthew 26-28",
    characters: ["Jesus", "Peter", "Judas", "Pilate", "Mary Magdalene"],
    category: "Gospels"
  },

  // === GENESIS STORIES ===
  {
    story: "Tamar's Deception of Judah",
    sequence: ["Widowed Twice by Er and Onan", "Denied to Shelah", "Disguised as Harlot at Enaim", "Takes Judah's Signet and Staff", "Proven More Righteous"],
    correct: ["Widowed Twice by Er and Onan", "Denied to Shelah", "Disguised as Harlot at Enaim", "Takes Judah's Signet and Staff", "Proven More Righteous"],
    book: "Genesis 38",
    characters: ["Tamar", "Judah", "Er", "Onan", "Shelah"],
    category: "Patriarchs"
  },
  {
    story: "Dinah and the Shechemites",
    sequence: ["Dinah Visits Canaanite Women", "Shechem Defiles Her", "Marriage Proposal Made", "Circumcision Demanded", "Simeon and Levi's Revenge"],
    correct: ["Dinah Visits Canaanite Women", "Shechem Defiles Her", "Marriage Proposal Made", "Circumcision Demanded", "Simeon and Levi's Revenge"],
    book: "Genesis 34",
    characters: ["Dinah", "Shechem", "Simeon", "Levi", "Jacob"],
    category: "Patriarchs"
  },
  {
    story: "The Tower of Babel",
    sequence: ["One Language on Earth", "Settled in Shinar", "Built City and Tower", "Lord Came Down to See", "Languages Confused", "People Scattered"],
    correct: ["One Language on Earth", "Settled in Shinar", "Built City and Tower", "Lord Came Down to See", "Languages Confused", "People Scattered"],
    book: "Genesis 11:1-9",
    characters: ["Nimrod"],
    category: "Primeval"
  },
  {
    story: "Lot's Wife Looks Back",
    sequence: ["Angels Arrive in Sodom", "Mob Surrounds House", "Family Warned to Flee", "Fire Rains from Heaven", "Wife Looks Back", "Becomes Pillar of Salt"],
    correct: ["Angels Arrive in Sodom", "Mob Surrounds House", "Family Warned to Flee", "Fire Rains from Heaven", "Wife Looks Back", "Becomes Pillar of Salt"],
    book: "Genesis 19",
    characters: ["Lot", "Lot's Wife", "Angels"],
    category: "Patriarchs"
  },
  {
    story: "Jacob Wrestles the Angel",
    sequence: ["Sent Family Across Jabbok", "Left Alone at Night", "Wrestled Until Daybreak", "Hip Socket Touched", "Blessed and Renamed Israel"],
    correct: ["Sent Family Across Jabbok", "Left Alone at Night", "Wrestled Until Daybreak", "Hip Socket Touched", "Blessed and Renamed Israel"],
    book: "Genesis 32:22-32",
    characters: ["Jacob", "Angel of the Lord"],
    category: "Patriarchs"
  },
  {
    story: "Creation Week",
    sequence: ["Light Created", "Firmament Divides Waters", "Dry Land and Plants", "Sun Moon and Stars", "Fish and Birds", "Animals and Man", "God Rested"],
    correct: ["Light Created", "Firmament Divides Waters", "Dry Land and Plants", "Sun Moon and Stars", "Fish and Birds", "Animals and Man", "God Rested"],
    book: "Genesis 1-2",
    characters: ["God", "Adam", "Eve"],
    category: "Primeval"
  },
  {
    story: "The Fall of Man",
    sequence: ["Serpent Questions Eve", "Fruit Eaten", "Eyes Opened", "Hiding from God", "Curses Pronounced", "Expelled from Garden"],
    correct: ["Serpent Questions Eve", "Fruit Eaten", "Eyes Opened", "Hiding from God", "Curses Pronounced", "Expelled from Garden"],
    book: "Genesis 3",
    characters: ["Adam", "Eve", "Serpent", "God"],
    category: "Primeval"
  },
  {
    story: "Noah's Flood",
    sequence: ["Ark Construction", "Animals Enter", "Rain Begins", "Flood Covers Earth", "Raven Sent Out", "Dove Returns with Olive", "Rainbow Covenant"],
    correct: ["Ark Construction", "Animals Enter", "Rain Begins", "Flood Covers Earth", "Raven Sent Out", "Dove Returns with Olive", "Rainbow Covenant"],
    book: "Genesis 6-9",
    characters: ["Noah", "Shem", "Ham", "Japheth"],
    category: "Primeval"
  },
  {
    story: "Abraham's Call",
    sequence: ["Called to Leave Ur", "Arrives in Canaan", "Famine Drives to Egypt", "Returns Wealthy", "Separates from Lot", "Promised Countless Descendants"],
    correct: ["Called to Leave Ur", "Arrives in Canaan", "Famine Drives to Egypt", "Returns Wealthy", "Separates from Lot", "Promised Countless Descendants"],
    book: "Genesis 12-13",
    characters: ["Abraham", "Sarah", "Lot"],
    category: "Patriarchs"
  },
  {
    story: "The Binding of Isaac",
    sequence: ["God Tests Abraham", "Three Day Journey", "Isaac Carries Wood", "Asks About the Lamb", "Bound on Altar", "Ram Caught in Thicket"],
    correct: ["God Tests Abraham", "Three Day Journey", "Isaac Carries Wood", "Asks About the Lamb", "Bound on Altar", "Ram Caught in Thicket"],
    book: "Genesis 22",
    characters: ["Abraham", "Isaac", "Angel of the Lord"],
    category: "Patriarchs"
  },

  // === JUDGES & WARRIORS ===
  {
    story: "Ehud the Left-Handed Judge",
    sequence: ["Israel Oppressed by Moab", "Ehud Makes Double-Edged Dagger", "Brings Tribute to Eglon", "Claims Secret Message", "Stabs Fat King", "Escapes Through Porch"],
    correct: ["Israel Oppressed by Moab", "Ehud Makes Double-Edged Dagger", "Brings Tribute to Eglon", "Claims Secret Message", "Stabs Fat King", "Escapes Through Porch"],
    book: "Judges 3:12-30",
    characters: ["Ehud", "Eglon"],
    category: "Judges"
  },
  {
    story: "Jael Kills Sisera",
    sequence: ["Sisera Flees Battle", "Jael Invites Him to Tent", "Gives Him Milk and Blanket", "Sisera Falls Asleep", "Drives Tent Peg Through Temple"],
    correct: ["Sisera Flees Battle", "Jael Invites Him to Tent", "Gives Him Milk and Blanket", "Sisera Falls Asleep", "Drives Tent Peg Through Temple"],
    book: "Judges 4:17-22",
    characters: ["Jael", "Sisera", "Deborah", "Barak"],
    category: "Judges"
  },
  {
    story: "Gideon's Fleece Test",
    sequence: ["Angel Appears at Winepress", "Gideon Asks for Sign", "Fleece Wet, Ground Dry", "Fleece Dry, Ground Wet", "Army Reduced to 300", "Torches in Jars Victory"],
    correct: ["Angel Appears at Winepress", "Gideon Asks for Sign", "Fleece Wet, Ground Dry", "Fleece Dry, Ground Wet", "Army Reduced to 300", "Torches in Jars Victory"],
    book: "Judges 6-7",
    characters: ["Gideon", "Angel of the Lord", "Midianites"],
    category: "Judges"
  },
  {
    story: "Jephthah's Tragic Vow",
    sequence: ["Outcast Son Returns", "Made Leader Against Ammon", "Vows First Thing That Greets Him", "Defeats Ammonites", "Daughter Comes Out Dancing", "Keeps His Vow"],
    correct: ["Outcast Son Returns", "Made Leader Against Ammon", "Vows First Thing That Greets Him", "Defeats Ammonites", "Daughter Comes Out Dancing", "Keeps His Vow"],
    book: "Judges 11",
    characters: ["Jephthah", "Jephthah's Daughter"],
    category: "Judges"
  },
  {
    story: "Samson and the Foxes",
    sequence: ["Wife Given to Another", "Catches 300 Foxes", "Ties Tails with Torches", "Burns Philistine Fields", "Philistines Burn Wife", "Samson's Great Slaughter"],
    correct: ["Wife Given to Another", "Catches 300 Foxes", "Ties Tails with Torches", "Burns Philistine Fields", "Philistines Burn Wife", "Samson's Great Slaughter"],
    book: "Judges 15:1-8",
    characters: ["Samson", "Philistines"],
    category: "Judges"
  },
  {
    story: "Samson and Delilah",
    sequence: ["Philistines Bribe Delilah", "Three False Answers", "Reveals Hair Secret", "Hair Shaved While Sleeping", "Captured and Blinded", "Pulls Down Temple Pillars"],
    correct: ["Philistines Bribe Delilah", "Three False Answers", "Reveals Hair Secret", "Hair Shaved While Sleeping", "Captured and Blinded", "Pulls Down Temple Pillars"],
    book: "Judges 16",
    characters: ["Samson", "Delilah", "Philistines"],
    category: "Judges"
  },
  {
    story: "The Levite's Concubine",
    sequence: ["Concubine Flees to Bethlehem", "Levite Retrieves Her", "Stops in Gibeah", "Wicked Men Surround House", "Concubine Abused All Night", "Israel Wars Against Benjamin"],
    correct: ["Concubine Flees to Bethlehem", "Levite Retrieves Her", "Stops in Gibeah", "Wicked Men Surround House", "Concubine Abused All Night", "Israel Wars Against Benjamin"],
    book: "Judges 19-21",
    characters: ["The Levite", "Concubine", "Men of Gibeah"],
    category: "Judges"
  },

  // === KINGS & PROPHETS ===
  {
    story: "Elijah and the Widow's Oil",
    sequence: ["Widow Has Only Oil and Flour", "Prophet Asks for Bread First", "Promise of Provision", "Jar Never Runs Empty", "Son Dies and Is Raised"],
    correct: ["Widow Has Only Oil and Flour", "Prophet Asks for Bread First", "Promise of Provision", "Jar Never Runs Empty", "Son Dies and Is Raised"],
    book: "1 Kings 17:8-24",
    characters: ["Elijah", "Widow of Zarephath"],
    category: "Prophets"
  },
  {
    story: "Elisha and the Bears",
    sequence: ["Elisha Travels to Bethel", "Youths Mock His Baldness", "Cursed in Name of Lord", "Two She-Bears Emerge", "Forty-Two Youths Mauled"],
    correct: ["Elisha Travels to Bethel", "Youths Mock His Baldness", "Cursed in Name of Lord", "Two She-Bears Emerge", "Forty-Two Youths Mauled"],
    book: "2 Kings 2:23-25",
    characters: ["Elisha"],
    category: "Prophets"
  },
  {
    story: "Naaman the Leper",
    sequence: ["Servant Girl Mentions Prophet", "Naaman Brings Gifts to Israel", "Told to Wash in Jordan", "Angry at Simple Instruction", "Washes Seven Times", "Skin Like Child's"],
    correct: ["Servant Girl Mentions Prophet", "Naaman Brings Gifts to Israel", "Told to Wash in Jordan", "Angry at Simple Instruction", "Washes Seven Times", "Skin Like Child's"],
    book: "2 Kings 5",
    characters: ["Naaman", "Elisha", "Servant Girl", "Gehazi"],
    category: "Prophets"
  },
  {
    story: "The Floating Axe Head",
    sequence: ["Prophets Building by Jordan", "Borrowed Axe Falls in Water", "Elisha Asks Where It Fell", "Throws Stick in River", "Iron Floats to Surface"],
    correct: ["Prophets Building by Jordan", "Borrowed Axe Falls in Water", "Elisha Asks Where It Fell", "Throws Stick in River", "Iron Floats to Surface"],
    book: "2 Kings 6:1-7",
    characters: ["Elisha", "Sons of the Prophets"],
    category: "Prophets"
  },
  {
    story: "Elisha's Bones Raise the Dead",
    sequence: ["Elisha Dies and Is Buried", "Moabite Raiders Attack", "Funeral Party Sees Raiders", "Body Thrown in Elisha's Tomb", "Corpse Touches Bones", "Man Revives and Stands"],
    correct: ["Elisha Dies and Is Buried", "Moabite Raiders Attack", "Funeral Party Sees Raiders", "Body Thrown in Elisha's Tomb", "Corpse Touches Bones", "Man Revives and Stands"],
    book: "2 Kings 13:20-21",
    characters: ["Elisha"],
    category: "Prophets"
  },
  {
    story: "Micaiah vs. 400 Prophets",
    sequence: ["Ahab Wants to Attack Ramoth", "400 Prophets Say Go", "Micaiah Summoned Reluctantly", "Tells of Lying Spirit Vision", "Zedekiah Slaps Micaiah", "Ahab Dies in Battle"],
    correct: ["Ahab Wants to Attack Ramoth", "400 Prophets Say Go", "Micaiah Summoned Reluctantly", "Tells of Lying Spirit Vision", "Zedekiah Slaps Micaiah", "Ahab Dies in Battle"],
    book: "1 Kings 22",
    characters: ["Ahab", "Micaiah", "Zedekiah", "Jehoshaphat"],
    category: "Prophets"
  },
  {
    story: "Elijah on Mount Carmel",
    sequence: ["Challenge Issued to Baal Prophets", "Baal Prophets Dance and Cut", "Elijah Mocks Baal", "Altar Drenched with Water", "Fire Falls from Heaven", "Prophets of Baal Slain"],
    correct: ["Challenge Issued to Baal Prophets", "Baal Prophets Dance and Cut", "Elijah Mocks Baal", "Altar Drenched with Water", "Fire Falls from Heaven", "Prophets of Baal Slain"],
    book: "1 Kings 18",
    characters: ["Elijah", "Ahab", "Prophets of Baal"],
    category: "Prophets"
  },

  // === STRANGE MIRACLES ===
  {
    story: "The Sun Stands Still",
    sequence: ["Israel Fights Amorites", "Joshua Commands Sun to Stop", "Moon Halts Over Aijalon", "Day Prolonged for Victory", "Hailstones Kill More Than Swords"],
    correct: ["Israel Fights Amorites", "Joshua Commands Sun to Stop", "Moon Halts Over Aijalon", "Day Prolonged for Victory", "Hailstones Kill More Than Swords"],
    book: "Joshua 10:1-14",
    characters: ["Joshua", "Amorite Kings"],
    category: "Conquest"
  },
  {
    story: "Balaam's Talking Donkey",
    sequence: ["Balak Summons Balaam to Curse", "Angel Blocks the Road", "Donkey Sees Angel, Swerves", "Balaam Beats Donkey Three Times", "Donkey Speaks to Balaam", "Balaam's Eyes Opened"],
    correct: ["Balak Summons Balaam to Curse", "Angel Blocks the Road", "Donkey Sees Angel, Swerves", "Balaam Beats Donkey Three Times", "Donkey Speaks to Balaam", "Balaam's Eyes Opened"],
    book: "Numbers 22",
    characters: ["Balaam", "Balak", "Donkey", "Angel of the Lord"],
    category: "Wilderness"
  },
  {
    story: "The Bronze Serpent",
    sequence: ["Israel Complains in Wilderness", "Fiery Serpents Sent", "Many Bitten and Die", "Moses Intercedes", "Bronze Serpent on Pole", "Those Who Look Are Healed"],
    correct: ["Israel Complains in Wilderness", "Fiery Serpents Sent", "Many Bitten and Die", "Moses Intercedes", "Bronze Serpent on Pole", "Those Who Look Are Healed"],
    book: "Numbers 21:4-9",
    characters: ["Moses", "Israelites"],
    category: "Wilderness"
  },
  {
    story: "Elijah's Chariot of Fire",
    sequence: ["Elijah Knows Departure Near", "Strikes Jordan with Cloak", "Waters Part for Crossing", "Asks Elisha's Request", "Whirlwind Approaches", "Chariot of Fire Separates Them"],
    correct: ["Elijah Knows Departure Near", "Strikes Jordan with Cloak", "Waters Part for Crossing", "Asks Elisha's Request", "Whirlwind Approaches", "Chariot of Fire Separates Them"],
    book: "2 Kings 2:1-12",
    characters: ["Elijah", "Elisha"],
    category: "Prophets"
  },
  {
    story: "Shadow Goes Backward",
    sequence: ["Hezekiah Deathly Ill", "Isaiah Pronounces Death", "King Prays Facing Wall", "God Adds Fifteen Years", "Sign Requested", "Shadow Retreats Ten Steps"],
    correct: ["Hezekiah Deathly Ill", "Isaiah Pronounces Death", "King Prays Facing Wall", "God Adds Fifteen Years", "Sign Requested", "Shadow Retreats Ten Steps"],
    book: "2 Kings 20:1-11",
    characters: ["Hezekiah", "Isaiah"],
    category: "Kings"
  },
  {
    story: "Walls of Jericho",
    sequence: ["Spies Hidden by Rahab", "March Around City Once Daily", "Seven Times on Seventh Day", "Priests Blow Trumpets", "People Shout", "Walls Fall Flat"],
    correct: ["Spies Hidden by Rahab", "March Around City Once Daily", "Seven Times on Seventh Day", "Priests Blow Trumpets", "People Shout", "Walls Fall Flat"],
    book: "Joshua 6",
    characters: ["Joshua", "Rahab", "Priests"],
    category: "Conquest"
  },

  // === WOMEN OF FAITH ===
  {
    story: "Rahab Hides the Spies",
    sequence: ["Two Spies Enter Jericho", "Hide in Rahab's House", "King's Men Come Searching", "Rahab Lies About Their Departure", "Lowers Them by Scarlet Cord", "Family Saved When Walls Fall"],
    correct: ["Two Spies Enter Jericho", "Hide in Rahab's House", "King's Men Come Searching", "Rahab Lies About Their Departure", "Lowers Them by Scarlet Cord", "Family Saved When Walls Fall"],
    book: "Joshua 2, 6",
    characters: ["Rahab", "Two Spies"],
    category: "Conquest"
  },
  {
    story: "Abigail Stops David's Wrath",
    sequence: ["David's Men Request Food", "Nabal Refuses Insulting", "David Vows to Kill All Males", "Abigail Gathers Provisions", "Intercepts David on Road", "David Blesses Her Wisdom"],
    correct: ["David's Men Request Food", "Nabal Refuses Insulting", "David Vows to Kill All Males", "Abigail Gathers Provisions", "Intercepts David on Road", "David Blesses Her Wisdom"],
    book: "1 Samuel 25",
    characters: ["Abigail", "David", "Nabal"],
    category: "Kings"
  },
  {
    story: "The Wise Woman of Abel",
    sequence: ["Sheba's Rebellion Against David", "Joab Besieges Abel Beth Maacah", "Wise Woman Calls from Wall", "Negotiates for City's Life", "Citizens Behead Sheba", "City Spared from Destruction"],
    correct: ["Sheba's Rebellion Against David", "Joab Besieges Abel Beth Maacah", "Wise Woman Calls from Wall", "Negotiates for City's Life", "Citizens Behead Sheba", "City Spared from Destruction"],
    book: "2 Samuel 20:14-22",
    characters: ["Wise Woman", "Joab", "Sheba"],
    category: "Kings"
  },
  {
    story: "The Shunammite's Faith",
    sequence: ["Wealthy Woman Hosts Elisha", "Builds Prophet's Chamber", "Promised a Son", "Son Dies Suddenly", "Rides to Find Elisha", "Elisha Raises Boy from Dead"],
    correct: ["Wealthy Woman Hosts Elisha", "Builds Prophet's Chamber", "Promised a Son", "Son Dies Suddenly", "Rides to Find Elisha", "Elisha Raises Boy from Dead"],
    book: "2 Kings 4:8-37",
    characters: ["Shunammite Woman", "Elisha", "Gehazi"],
    category: "Prophets"
  },
  {
    story: "Rizpah Guards the Dead",
    sequence: ["Famine Lasts Three Years", "Saul's Descendants Given to Gibeonites", "Seven Sons Hanged", "Rizpah Spreads Sackcloth on Rock", "Guards Bodies from Birds and Beasts", "David Gives Proper Burial"],
    correct: ["Famine Lasts Three Years", "Saul's Descendants Given to Gibeonites", "Seven Sons Hanged", "Rizpah Spreads Sackcloth on Rock", "Guards Bodies from Birds and Beasts", "David Gives Proper Burial"],
    book: "2 Samuel 21:1-14",
    characters: ["Rizpah", "David"],
    category: "Kings"
  },
  {
    story: "Ruth's Loyalty",
    sequence: ["Naomi Loses Husband and Sons", "Ruth Refuses to Leave", "Gleans in Boaz's Field", "Lies at Boaz's Feet", "Boaz Redeems at Gate", "Ruth Bears Obed"],
    correct: ["Naomi Loses Husband and Sons", "Ruth Refuses to Leave", "Gleans in Boaz's Field", "Lies at Boaz's Feet", "Boaz Redeems at Gate", "Ruth Bears Obed"],
    book: "Ruth 1-4",
    characters: ["Ruth", "Naomi", "Boaz", "Obed"],
    category: "Historical"
  },
  {
    story: "Esther Saves Her People",
    sequence: ["Esther Becomes Queen", "Haman Plots Against Jews", "Mordecai Urges Esther to Act", "Esther Approaches King Unsummoned", "Haman's Plot Exposed", "Haman Hanged on Own Gallows"],
    correct: ["Esther Becomes Queen", "Haman Plots Against Jews", "Mordecai Urges Esther to Act", "Esther Approaches King Unsummoned", "Haman's Plot Exposed", "Haman Hanged on Own Gallows"],
    book: "Esther 1-9",
    characters: ["Esther", "Mordecai", "Haman", "King Ahasuerus"],
    category: "Historical"
  },

  // === PROPHETIC ACTS ===
  {
    story: "Isaiah Walks Naked",
    sequence: ["God Commands Isaiah", "Removes Sackcloth and Sandals", "Walks Naked Three Years", "Sign Against Egypt and Cush", "Predicts Their Captivity"],
    correct: ["God Commands Isaiah", "Removes Sackcloth and Sandals", "Walks Naked Three Years", "Sign Against Egypt and Cush", "Predicts Their Captivity"],
    book: "Isaiah 20",
    characters: ["Isaiah"],
    category: "Prophets"
  },
  {
    story: "Ezekiel's Siege Brick",
    sequence: ["Commanded to Take Clay Brick", "Draws Jerusalem on It", "Builds Miniature Siege Works", "Lies on Left Side 390 Days", "Lies on Right Side 40 Days", "Cooks Food over Dung"],
    correct: ["Commanded to Take Clay Brick", "Draws Jerusalem on It", "Builds Miniature Siege Works", "Lies on Left Side 390 Days", "Lies on Right Side 40 Days", "Cooks Food over Dung"],
    book: "Ezekiel 4",
    characters: ["Ezekiel"],
    category: "Prophets"
  },
  {
    story: "Hosea Marries a Prostitute",
    sequence: ["God Commands Marriage to Gomer", "First Child Named Jezreel", "Daughter Named Lo-Ruhamah", "Son Named Lo-Ammi", "Gomer Returns to Prostitution", "Hosea Buys Her Back"],
    correct: ["God Commands Marriage to Gomer", "First Child Named Jezreel", "Daughter Named Lo-Ruhamah", "Son Named Lo-Ammi", "Gomer Returns to Prostitution", "Hosea Buys Her Back"],
    book: "Hosea 1-3",
    characters: ["Hosea", "Gomer"],
    category: "Prophets"
  },
  {
    story: "Jeremiah's Linen Belt",
    sequence: ["Buys Linen Waistband", "Wears It Without Washing", "Told to Hide at Euphrates", "Returns After Many Days", "Belt Ruined and Useless", "Represents Judah's Pride"],
    correct: ["Buys Linen Waistband", "Wears It Without Washing", "Told to Hide at Euphrates", "Returns After Many Days", "Belt Ruined and Useless", "Represents Judah's Pride"],
    book: "Jeremiah 13:1-11",
    characters: ["Jeremiah"],
    category: "Prophets"
  },
  {
    story: "Ezekiel's Wife Dies",
    sequence: ["God Warns Wife Will Die", "Told Not to Mourn", "No Tears or Funeral Bread", "Wife Dies That Evening", "People Ask Why No Mourning", "Sign of Temple's Destruction"],
    correct: ["God Warns Wife Will Die", "Told Not to Mourn", "No Tears or Funeral Bread", "Wife Dies That Evening", "People Ask Why No Mourning", "Sign of Temple's Destruction"],
    book: "Ezekiel 24:15-27",
    characters: ["Ezekiel", "Ezekiel's Wife"],
    category: "Prophets"
  },

  // === NEW TESTAMENT ===
  {
    story: "Ananias and Sapphira",
    sequence: ["Sell Property for Church", "Keep Back Part of Price", "Lie About Full Donation", "Ananias Falls Dead", "Sapphira Arrives Three Hours Later", "She Also Falls Dead"],
    correct: ["Sell Property for Church", "Keep Back Part of Price", "Lie About Full Donation", "Ananias Falls Dead", "Sapphira Arrives Three Hours Later", "She Also Falls Dead"],
    book: "Acts 5:1-11",
    characters: ["Ananias", "Sapphira", "Peter"],
    category: "Acts"
  },
  {
    story: "Eutychus Falls from Window",
    sequence: ["Paul Preaches Until Midnight", "Young Man Sits in Window", "Overcome by Sleep", "Falls from Third Story", "Taken Up Dead", "Paul Embraces Him and He Lives"],
    correct: ["Paul Preaches Until Midnight", "Young Man Sits in Window", "Overcome by Sleep", "Falls from Third Story", "Taken Up Dead", "Paul Embraces Him and He Lives"],
    book: "Acts 20:7-12",
    characters: ["Paul", "Eutychus"],
    category: "Acts"
  },
  {
    story: "The Seven Sons of Sceva",
    sequence: ["Jewish Exorcists Use Jesus' Name", "Evil Spirit Questions Them", "Spirit Says I Know Jesus and Paul", "Possessed Man Attacks All Seven", "They Flee Naked and Wounded", "Fear Falls on Ephesus"],
    correct: ["Jewish Exorcists Use Jesus' Name", "Evil Spirit Questions Them", "Spirit Says I Know Jesus and Paul", "Possessed Man Attacks All Seven", "They Flee Naked and Wounded", "Fear Falls on Ephesus"],
    book: "Acts 19:13-20",
    characters: ["Seven Sons of Sceva", "Possessed Man"],
    category: "Acts"
  },
  {
    story: "Paul Bitten by Viper",
    sequence: ["Shipwrecked on Malta", "Gathering Sticks for Fire", "Viper Fastens on Hand", "Islanders Expect Him to Die", "Paul Shakes It Off Unharmed", "They Call Him a God"],
    correct: ["Shipwrecked on Malta", "Gathering Sticks for Fire", "Viper Fastens on Hand", "Islanders Expect Him to Die", "Paul Shakes It Off Unharmed", "They Call Him a God"],
    book: "Acts 28:1-6",
    characters: ["Paul", "Maltese Islanders"],
    category: "Acts"
  },
  {
    story: "The Daughter of Herodias Dances",
    sequence: ["Herod's Birthday Feast", "Daughter Dances for Guests", "Herod Offers Up to Half Kingdom", "Mother Suggests John's Head", "Girl Requests Head on Platter", "John the Baptist Beheaded"],
    correct: ["Herod's Birthday Feast", "Daughter Dances for Guests", "Herod Offers Up to Half Kingdom", "Mother Suggests John's Head", "Girl Requests Head on Platter", "John the Baptist Beheaded"],
    book: "Mark 6:21-28",
    characters: ["Herod", "Herodias", "Salome", "John the Baptist"],
    category: "Gospels"
  },
  {
    story: "Jesus Feeds 5000",
    sequence: ["Crowds Follow Jesus", "Disciples Want to Send Away", "Boy Has Five Loaves Two Fish", "Jesus Blesses and Breaks", "All Eat and Are Satisfied", "Twelve Baskets Left Over"],
    correct: ["Crowds Follow Jesus", "Disciples Want to Send Away", "Boy Has Five Loaves Two Fish", "Jesus Blesses and Breaks", "All Eat and Are Satisfied", "Twelve Baskets Left Over"],
    book: "John 6:1-14",
    characters: ["Jesus", "Disciples", "Boy with Lunch"],
    category: "Gospels"
  },
  {
    story: "Jesus Walks on Water",
    sequence: ["Disciples Sent Ahead by Boat", "Storm Arises on Sea", "Jesus Walks Toward Them", "Disciples Cry Out in Fear", "Peter Walks Then Sinks", "Jesus Catches Him"],
    correct: ["Disciples Sent Ahead by Boat", "Storm Arises on Sea", "Jesus Walks Toward Them", "Disciples Cry Out in Fear", "Peter Walks Then Sinks", "Jesus Catches Him"],
    book: "Matthew 14:22-33",
    characters: ["Jesus", "Peter", "Disciples"],
    category: "Gospels"
  },
  {
    story: "Raising of Lazarus",
    sequence: ["Lazarus Falls Sick", "Jesus Delays Two Days", "Lazarus Dies and Is Buried", "Jesus Weeps at Tomb", "Stone Rolled Away", "Lazarus Comes Out Bound"],
    correct: ["Lazarus Falls Sick", "Jesus Delays Two Days", "Lazarus Dies and Is Buried", "Jesus Weeps at Tomb", "Stone Rolled Away", "Lazarus Comes Out Bound"],
    book: "John 11:1-44",
    characters: ["Jesus", "Lazarus", "Mary", "Martha"],
    category: "Gospels"
  },

  // === DARK CHAPTERS ===
  {
    story: "Absalom's Rebellion",
    sequence: ["Absalom Steals Hearts of Israel", "Declares Himself King in Hebron", "David Flees Jerusalem", "Ahithophel's Counsel Rejected", "Battle in Forest of Ephraim", "Absalom Caught in Oak Tree"],
    correct: ["Absalom Steals Hearts of Israel", "Declares Himself King in Hebron", "David Flees Jerusalem", "Ahithophel's Counsel Rejected", "Battle in Forest of Ephraim", "Absalom Caught in Oak Tree"],
    book: "2 Samuel 15-18",
    characters: ["Absalom", "David", "Ahithophel", "Joab"],
    category: "Kings"
  },
  {
    story: "Athaliah the Usurper",
    sequence: ["Ahaziah Dies in Battle", "Athaliah Kills Royal Family", "Baby Joash Hidden in Temple", "Six Years of Wicked Rule", "Jehoiada Reveals Hidden King", "Athaliah Executed at Gate"],
    correct: ["Ahaziah Dies in Battle", "Athaliah Kills Royal Family", "Baby Joash Hidden in Temple", "Six Years of Wicked Rule", "Jehoiada Reveals Hidden King", "Athaliah Executed at Gate"],
    book: "2 Kings 11",
    characters: ["Athaliah", "Joash", "Jehoiada", "Jehosheba"],
    category: "Kings"
  },
  {
    story: "Jezebel's End",
    sequence: ["Jehu Comes to Jezreel", "Jezebel Paints Her Face", "Looks Down from Window", "Eunuchs Throw Her Down", "Dogs Eat Her Flesh", "Only Skull and Hands Remain"],
    correct: ["Jehu Comes to Jezreel", "Jezebel Paints Her Face", "Looks Down from Window", "Eunuchs Throw Her Down", "Dogs Eat Her Flesh", "Only Skull and Hands Remain"],
    book: "2 Kings 9:30-37",
    characters: ["Jezebel", "Jehu"],
    category: "Kings"
  },
  {
    story: "The Cannibalism of Samaria",
    sequence: ["Ben-Hadad Besieges Samaria", "Famine Grows Severe", "Woman Cries to King", "Two Mothers Made Pact", "One Son Already Eaten", "King Tears His Robes"],
    correct: ["Ben-Hadad Besieges Samaria", "Famine Grows Severe", "Woman Cries to King", "Two Mothers Made Pact", "One Son Already Eaten", "King Tears His Robes"],
    book: "2 Kings 6:24-30",
    characters: ["King of Israel", "Two Mothers"],
    category: "Kings"
  },
  {
    story: "Judas Iscariot's End",
    sequence: ["Betrays Jesus for 30 Silver", "Leads Soldiers to Garden", "Kisses Jesus as Signal", "Filled with Remorse", "Returns Money to Priests", "Hangs Himself"],
    correct: ["Betrays Jesus for 30 Silver", "Leads Soldiers to Garden", "Kisses Jesus as Signal", "Filled with Remorse", "Returns Money to Priests", "Hangs Himself"],
    book: "Matthew 26-27",
    characters: ["Judas", "Jesus", "Chief Priests"],
    category: "Gospels"
  },

  // === BONUS STORIES ===
  {
    story: "Achan's Hidden Sin",
    sequence: ["Jericho Falls to Israel", "Achan Takes Devoted Things", "Israel Defeated at Ai", "Lots Cast to Find Guilty", "Achan Confesses Theft", "Stoned in Valley of Achor"],
    correct: ["Jericho Falls to Israel", "Achan Takes Devoted Things", "Israel Defeated at Ai", "Lots Cast to Find Guilty", "Achan Confesses Theft", "Stoned in Valley of Achor"],
    book: "Joshua 7",
    characters: ["Achan", "Joshua"],
    category: "Conquest"
  },
  {
    story: "Uzzah Touches the Ark",
    sequence: ["David Brings Ark from Abinadab", "Ark Placed on New Cart", "Oxen Stumble at Threshing Floor", "Uzzah Reaches Out to Steady", "God Strikes Uzzah Dead", "David Afraid to Continue"],
    correct: ["David Brings Ark from Abinadab", "Ark Placed on New Cart", "Oxen Stumble at Threshing Floor", "Uzzah Reaches Out to Steady", "God Strikes Uzzah Dead", "David Afraid to Continue"],
    book: "2 Samuel 6:1-11",
    characters: ["David", "Uzzah"],
    category: "Kings"
  },
  {
    story: "Gehazi's Greed",
    sequence: ["Naaman Healed of Leprosy", "Elisha Refuses Payment", "Gehazi Runs After Naaman", "Lies About Needing Silver", "Returns with Clothing and Talents", "Struck with Naaman's Leprosy"],
    correct: ["Naaman Healed of Leprosy", "Elisha Refuses Payment", "Gehazi Runs After Naaman", "Lies About Needing Silver", "Returns with Clothing and Talents", "Struck with Naaman's Leprosy"],
    book: "2 Kings 5:20-27",
    characters: ["Gehazi", "Elisha", "Naaman"],
    category: "Prophets"
  },
  {
    story: "The Witch of Endor",
    sequence: ["Saul Faces Philistine Army", "God Does Not Answer Him", "Seeks Woman with Familiar Spirit", "Samuel's Spirit Appears", "Prophesies Saul's Death", "Saul Falls Terrified"],
    correct: ["Saul Faces Philistine Army", "God Does Not Answer Him", "Seeks Woman with Familiar Spirit", "Samuel's Spirit Appears", "Prophesies Saul's Death", "Saul Falls Terrified"],
    book: "1 Samuel 28",
    characters: ["Saul", "Witch of Endor", "Samuel"],
    category: "Kings"
  },
  {
    story: "Adonijah's Failed Coup",
    sequence: ["Adonijah Declares Himself King", "Sacrifices at En Rogel", "Nathan and Bathsheba Inform David", "Solomon Anointed at Gihon", "Guests Flee in Terror", "Adonijah Grasps Altar Horns"],
    correct: ["Adonijah Declares Himself King", "Sacrifices at En Rogel", "Nathan and Bathsheba Inform David", "Solomon Anointed at Gihon", "Guests Flee in Terror", "Adonijah Grasps Altar Horns"],
    book: "1 Kings 1",
    characters: ["Adonijah", "Solomon", "David", "Nathan", "Bathsheba"],
    category: "Kings"
  },
  {
    story: "Zimri's Seven-Day Reign",
    sequence: ["Zimri Kills King Elah", "Destroys House of Baasha", "Israel Proclaims Omri King", "Omri Besieges Tirzah", "Zimri Burns Palace on Himself", "Dies After Only Seven Days"],
    correct: ["Zimri Kills King Elah", "Destroys House of Baasha", "Israel Proclaims Omri King", "Omri Besieges Tirzah", "Zimri Burns Palace on Himself", "Dies After Only Seven Days"],
    book: "1 Kings 16:8-20",
    characters: ["Zimri", "Elah", "Omri"],
    category: "Kings"
  },
  {
    story: "The Poisoned Stew",
    sequence: ["Famine in the Land", "Elisha's Students Cook Stew", "Someone Adds Wild Gourds", "Cry Out There Is Death in Pot", "Elisha Adds Flour", "Stew Becomes Harmless"],
    correct: ["Famine in the Land", "Elisha's Students Cook Stew", "Someone Adds Wild Gourds", "Cry Out There Is Death in Pot", "Elisha Adds Flour", "Stew Becomes Harmless"],
    book: "2 Kings 4:38-41",
    characters: ["Elisha", "Sons of the Prophets"],
    category: "Prophets"
  },
  {
    story: "Jonah and the Great Fish",
    sequence: ["Called to Go to Nineveh", "Flees on Ship to Tarshish", "Storm Threatens to Sink Ship", "Thrown Overboard", "Swallowed by Great Fish", "Vomited onto Dry Land"],
    correct: ["Called to Go to Nineveh", "Flees on Ship to Tarshish", "Storm Threatens to Sink Ship", "Thrown Overboard", "Swallowed by Great Fish", "Vomited onto Dry Land"],
    book: "Jonah 1-2",
    characters: ["Jonah", "Sailors"],
    category: "Prophets"
  },
  {
    story: "The Good Samaritan",
    sequence: ["Man Travels to Jericho", "Robbers Beat and Leave Half Dead", "Priest Passes By", "Levite Passes By", "Samaritan Binds Wounds", "Pays Innkeeper to Care"],
    correct: ["Man Travels to Jericho", "Robbers Beat and Leave Half Dead", "Priest Passes By", "Levite Passes By", "Samaritan Binds Wounds", "Pays Innkeeper to Care"],
    book: "Luke 10:25-37",
    characters: ["Traveler", "Priest", "Levite", "Samaritan", "Innkeeper"],
    category: "Gospels"
  },
  {
    story: "Prodigal Son",
    sequence: ["Younger Son Asks for Inheritance", "Squanders Wealth in Far Country", "Famine Comes", "Feeds Pigs and Envies Pods", "Returns Home Repentant", "Father Throws Great Feast"],
    correct: ["Younger Son Asks for Inheritance", "Squanders Wealth in Far Country", "Famine Comes", "Feeds Pigs and Envies Pods", "Returns Home Repentant", "Father Throws Great Feast"],
    book: "Luke 15:11-32",
    characters: ["Prodigal Son", "Father", "Elder Brother"],
    category: "Gospels"
  },
  {
    story: "Paul's Conversion",
    sequence: ["Saul Persecutes Church", "Bright Light on Damascus Road", "Voice Asks Why Persecuting", "Blinded for Three Days", "Ananias Restores Sight", "Baptized and Preaches Christ"],
    correct: ["Saul Persecutes Church", "Bright Light on Damascus Road", "Voice Asks Why Persecuting", "Blinded for Three Days", "Ananias Restores Sight", "Baptized and Preaches Christ"],
    book: "Acts 9:1-19",
    characters: ["Paul/Saul", "Jesus", "Ananias"],
    category: "Acts"
  },
  {
    story: "Peter's Vision",
    sequence: ["Peter Prays on Rooftop", "Falls into Trance", "Sheet Descends with Animals", "Voice Says Kill and Eat", "Peter Objects Three Times", "Messengers from Cornelius Arrive"],
    correct: ["Peter Prays on Rooftop", "Falls into Trance", "Sheet Descends with Animals", "Voice Says Kill and Eat", "Peter Objects Three Times", "Messengers from Cornelius Arrive"],
    book: "Acts 10:9-23",
    characters: ["Peter", "Cornelius"],
    category: "Acts"
  },
  {
    story: "Pentecost",
    sequence: ["Disciples Gathered in Upper Room", "Sound Like Rushing Wind", "Tongues of Fire Appear", "Speak in Other Languages", "Crowd Amazed and Perplexed", "Peter Preaches 3000 Saved"],
    correct: ["Disciples Gathered in Upper Room", "Sound Like Rushing Wind", "Tongues of Fire Appear", "Speak in Other Languages", "Crowd Amazed and Perplexed", "Peter Preaches 3000 Saved"],
    book: "Acts 2:1-41",
    characters: ["Disciples", "Peter", "Holy Spirit"],
    category: "Acts"
  },
];

// Get unique categories
const getAllCategories = () => {
  const categories = new Set(storyQuizzes.map(q => q.category).filter(Boolean));
  return Array.from(categories) as string[];
};

// Get all unique characters
const getAllCharacters = () => {
  const characters = new Set(storyQuizzes.flatMap(q => q.characters || []));
  return Array.from(characters);
};

// Get all unique books
const getAllBooks = () => {
  const books = new Set(storyQuizzes.map(q => q.book));
  return Array.from(books);
};

export default function StoryRoomGame() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [challengeType, setChallengeType] = useState<ChallengeType>("sequence");
  const [completedStoryIds, setCompletedStoryIds] = useState<Set<number>>(new Set());
  const [availableQuizzes, setAvailableQuizzes] = useState<StoryQuiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<StoryQuiz | null>(null);

  // Challenge state
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [availableScenes, setAvailableScenes] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answerOptions, setAnswerOptions] = useState<string[]>([]);
  const [missingSceneIndex, setMissingSceneIndex] = useState<number>(0);

  // Scoring and progress
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(0);

  // Timer
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  // UI state
  const [feedback, setFeedback] = useState<string>("");
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Shuffle array helper
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Initialize game
  const startGame = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];

    // Filter and shuffle quizzes
    const filtered = storyQuizzes.filter((_, idx) => !completedStoryIds.has(idx));
    const shuffled = shuffleArray(filtered);

    // Limit to reasonable session size
    const sessionQuizzes = shuffled.slice(0, Math.min(20, shuffled.length));

    setAvailableQuizzes(sessionQuizzes);
    setCurrentQuizIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTotalAttempts(0);
    setCorrectAnswers(0);
    setHintsUsed(0);
    setHintsRemaining(settings.hintsAllowed);
    setIsComplete(false);
    setGameStarted(true);

    if (sessionQuizzes.length > 0) {
      setupChallenge(sessionQuizzes[0], challengeType, settings);
    }
  }, [difficulty, challengeType, completedStoryIds]);

  // Setup challenge based on type
  const setupChallenge = useCallback((quiz: StoryQuiz, type: ChallengeType, settings: DifficultySettings) => {
    setCurrentQuiz(quiz);
    setFeedback("");
    setShowHint(false);
    setSelectedAnswer("");

    // Set timer if applicable
    if (settings.timeLimit) {
      setTimeRemaining(settings.timeLimit);
      setTimerActive(true);
    } else {
      setTimeRemaining(null);
      setTimerActive(false);
    }

    switch (type) {
      case "sequence":
        // Limit scenes based on difficulty
        const limitedSequence = quiz.sequence.slice(0, settings.maxScenes);
        setAvailableScenes(shuffleArray(limitedSequence));
        setUserSequence([]);
        break;

      case "identify":
        // Show scenes, guess the story
        setAvailableScenes(shuffleArray(quiz.sequence.slice(0, 3)));
        // Generate wrong answers from other stories
        const wrongStories = shuffleArray(
          storyQuizzes.filter(q => q.story !== quiz.story)
        ).slice(0, 3).map(q => q.story);
        setAnswerOptions(shuffleArray([quiz.story, ...wrongStories]));
        break;

      case "missing":
        // Show sequence with one missing
        const fullSeq = [...quiz.sequence];
        const missingIdx = Math.floor(Math.random() * fullSeq.length);
        setMissingSceneIndex(missingIdx);
        const withMissing = fullSeq.map((s, i) => i === missingIdx ? "???" : s);
        setAvailableScenes(withMissing);
        // Generate options
        const wrongScenes = shuffleArray(
          storyQuizzes
            .filter(q => q.story !== quiz.story)
            .flatMap(q => q.sequence)
        ).slice(0, 3);
        setAnswerOptions(shuffleArray([fullSeq[missingIdx], ...wrongScenes]));
        break;

      case "character":
        // Match characters to story
        if (quiz.characters && quiz.characters.length > 0) {
          const wrongChars = shuffleArray(
            getAllCharacters().filter(c => !quiz.characters?.includes(c))
          ).slice(0, 3);
          setAnswerOptions(shuffleArray([quiz.characters[0], ...wrongChars]));
        }
        break;

      case "book":
        // Identify the book
        const wrongBooks = shuffleArray(
          getAllBooks().filter(b => b !== quiz.book)
        ).slice(0, 3);
        setAnswerOptions(shuffleArray([quiz.book, ...wrongBooks]));
        break;
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (!timerActive || timeRemaining === null) return;

    if (timeRemaining <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev !== null ? prev - 1 : null);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  const handleTimeUp = () => {
    setTimerActive(false);
    setFeedback(t('games.common.timeUp'));
    toast({
      title: t('games.common.timeUp'),
      description: t('games.storyRoom.movingToNext'),
      variant: "destructive",
    });

    setTimeout(() => moveToNextQuiz(), 2000);
  };

  // Handle scene click for sequence challenge
  const handleSceneClick = (scene: string) => {
    if (challengeType !== "sequence") return;
    setUserSequence([...userSequence, scene]);
    setAvailableScenes(availableScenes.filter(s => s !== scene));
  };

  const handleRemoveScene = (index: number) => {
    const scene = userSequence[index];
    setAvailableScenes([...availableScenes, scene]);
    setUserSequence(userSequence.filter((_, i) => i !== index));
  };

  // Handle answer selection for other challenge types
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Use hint
  const useHint = () => {
    if (hintsRemaining <= 0 || !currentQuiz) return;

    setHintsRemaining(prev => prev - 1);
    setHintsUsed(prev => prev + 1);
    setShowHint(true);

    toast({
      title: t('games.common.hintUsed'),
      description: t('games.common.hintsRemaining', { count: hintsRemaining - 1 }),
    });
  };

  // Get hint text based on challenge type
  const getHintText = () => {
    if (!currentQuiz) return "";

    switch (challengeType) {
      case "sequence":
        return `The story starts with: "${currentQuiz.correct[0]}"`;
      case "identify":
        return `This story is from ${currentQuiz.book}`;
      case "missing":
        return `The missing scene involves: ${currentQuiz.correct[missingSceneIndex].split(" ")[0]}...`;
      case "character":
        return `This character appears in ${currentQuiz.book}`;
      case "book":
        return `The story is: ${currentQuiz.story}`;
      default:
        return "";
    }
  };

  // Check answer
  const checkAnswer = () => {
    if (!currentQuiz) return;

    setTotalAttempts(prev => prev + 1);
    setTimerActive(false);

    let isCorrect = false;
    const settings = DIFFICULTY_SETTINGS[difficulty];

    switch (challengeType) {
      case "sequence":
        const limitedCorrect = currentQuiz.correct.slice(0, settings.maxScenes);
        isCorrect = JSON.stringify(userSequence) === JSON.stringify(limitedCorrect);
        break;
      case "identify":
        isCorrect = selectedAnswer === currentQuiz.story;
        break;
      case "missing":
        isCorrect = selectedAnswer === currentQuiz.correct[missingSceneIndex];
        break;
      case "character":
        isCorrect = currentQuiz.characters?.includes(selectedAnswer) || false;
        break;
      case "book":
        isCorrect = selectedAnswer === currentQuiz.book;
        break;
    }

    if (isCorrect) {
      const basePoints = 100;
      const multiplier = settings.pointsMultiplier;
      const streakBonus = streak * 10;
      const timeBonus = timeRemaining ? Math.floor(timeRemaining / 2) : 0;
      const hintPenalty = hintsUsed * 20;

      const pointsEarned = Math.max(0, Math.floor((basePoints + streakBonus + timeBonus - hintPenalty) * multiplier));

      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      setBestStreak(prev => Math.max(prev, streak + 1));
      setCorrectAnswers(prev => prev + 1);
      setFeedback(t('games.common.correctPlusPoints', { points: pointsEarned }));

      // Mark as completed
      const quizIdx = storyQuizzes.findIndex(q => q.story === currentQuiz.story);
      if (quizIdx >= 0) {
        setCompletedStoryIds(prev => new Set([...prev, quizIdx]));
      }

      toast({
        title: t('games.common.correct'),
        description: t('games.common.plusPointsStreak', { points: pointsEarned, streak: streak + 1 }),
      });

      setTimeout(() => moveToNextQuiz(), 1500);
    } else {
      setStreak(0);
      setFeedback(t('games.storyRoom.incorrectTryAgain'));

      toast({
        title: t('games.common.notQuiteRight'),
        description: t('games.storyRoom.keepTryingOrHint'),
        variant: "destructive",
      });
    }
  };

  const moveToNextQuiz = () => {
    const nextIndex = currentQuizIndex + 1;

    if (nextIndex >= availableQuizzes.length) {
      setIsComplete(true);
      saveScore();
    } else {
      setCurrentQuizIndex(nextIndex);
      setupChallenge(availableQuizzes[nextIndex], challengeType, DIFFICULTY_SETTINGS[difficulty]);
    }
  };

  const skipQuiz = () => {
    setStreak(0);
    moveToNextQuiz();
  };

  // Save score to database
  const saveScore = async () => {
    if (!user || score === 0) return;

    try {
      await supabase.from("game_scores").insert({
        user_id: user.id,
        game_type: "story_room",
        score: score,
        mode: difficulty,
        metadata: {
          total_questions: totalAttempts,
          correct_answers: correctAnswers,
          best_streak: bestStreak,
          hints_used: hintsUsed,
          challenge_type: challengeType,
          completed_at: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // Reset game
  const resetGame = () => {
    setGameStarted(false);
    setIsComplete(false);
    setCompletedStoryIds(new Set());
  };

  const settings = DIFFICULTY_SETTINGS[difficulty];

  // Completion screen
  if (isComplete) {
    const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;

    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
                <CardTitle className="text-3xl">{t('games.common.sessionComplete')}</CardTitle>
                <CardDescription>
                  {t('games.storyRoom.completedRound')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="text-3xl font-bold text-primary">{score}</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.totalScore')}</div>
                  </div>
                  <div className="p-4 bg-green-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.accuracy')}</div>
                  </div>
                  <div className="p-4 bg-orange-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{bestStreak}</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.bestStreak')}</div>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{correctAnswers}</div>
                    <div className="text-sm text-muted-foreground">{t('games.common.correct')}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Badge className={settings.color}>{t(`games.common.difficulty.${difficulty}`)}</Badge>
                  <Badge variant="outline">{CHALLENGE_TYPES[challengeType].name}</Badge>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/games")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('games.common.backToGames')}
                  </Button>
                  <Button onClick={resetGame} variant="outline">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    {t('games.common.playAgain')}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <GameLeaderboard gameType="story_room" currentScore={score} />
          </div>
        </main>
      </div>
    );
  }

  // Game setup screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/games")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('games.common.backToGames')}
          </Button>

          <Tabs defaultValue="game" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="library" className="flex items-center gap-2">
                <Library className="h-4 w-4" />
                {t('games.storyRoom.storyLibrary')}
              </TabsTrigger>
              <TabsTrigger value="game" className="flex items-center gap-2">
                <Gamepad2 className="h-4 w-4" />
                {t('games.storyRoom.playGame')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library">
              <StoryLibrary />
            </TabsContent>

            <TabsContent value="game" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl flex items-center gap-2">
                    <span className="text-4xl">📚</span>
                    {t('games.storyRoom.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('games.storyRoom.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{t('games.storyRoom.totalStories', { count: storyQuizzes.length })}</span>
                    <span>•</span>
                    <span>{t('games.storyRoom.completedThisSession', { count: completedStoryIds.size })}</span>
                    <span>•</span>
                    <span>{t('games.storyRoom.remaining', { count: storyQuizzes.length - completedStoryIds.size })}</span>
                  </div>

                  {/* Difficulty Selection */}
                  <div>
                    <h3 className="font-semibold mb-3">{t('games.common.selectDifficulty')}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((d) => {
                        const s = DIFFICULTY_SETTINGS[d];
                        return (
                          <Card
                            key={d}
                            className={`cursor-pointer transition-all ${
                              difficulty === d
                                ? "ring-2 ring-primary border-primary"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => setDifficulty(d)}
                          >
                            <CardContent className="p-4 text-center">
                              <div className={`inline-flex p-2 rounded-full ${s.color} text-white mb-2`}>
                                {s.icon}
                              </div>
                              <div className="font-semibold">{t(`games.common.difficulty.${d}`)}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {s.description}
                              </div>
                              <div className="text-xs mt-2 space-y-1">
                                <div>{t('games.common.hintsCount', { count: s.hintsAllowed })}</div>
                                <div>{s.timeLimit ? t('games.common.timeLimit', { seconds: s.timeLimit }) : t('games.common.noTimer')}</div>
                                <div>{t('games.common.pointsMultiplier', { multiplier: s.pointsMultiplier })}</div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  {/* Challenge Type Selection */}
                  <div>
                    <h3 className="font-semibold mb-3">{t('games.storyRoom.selectChallengeType')}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {(Object.keys(CHALLENGE_TYPES) as ChallengeType[]).map((type) => {
                        const info = CHALLENGE_TYPES[type];
                        return (
                          <Card
                            key={type}
                            className={`cursor-pointer transition-all ${
                              challengeType === type
                                ? "ring-2 ring-primary border-primary"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() => setChallengeType(type)}
                          >
                            <CardContent className="p-3 text-center">
                              <div className="inline-flex p-2 rounded-full bg-primary/10 text-primary mb-2">
                                {info.icon}
                              </div>
                              <div className="font-medium text-sm">{info.name}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {info.description}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <Button onClick={startGame} size="lg" className="w-full">
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    {t('games.storyRoom.startChallenge')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">{t('games.storyRoom.tipsTitle')}</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {t('games.storyRoom.tip1')}</li>
                    <li>• {t('games.storyRoom.tip2')}</li>
                    <li>• {t('games.storyRoom.tip3')}</li>
                    <li>• {t('games.storyRoom.tip4')}</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  // Active game screen
  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('common.loading')}</h2>
        </div>
      </div>
    );
  }

  const progress = ((currentQuizIndex + 1) / availableQuizzes.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => setGameStarted(false)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('games.storyRoom.exitGame')}
        </Button>

        {/* Game Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge className={settings.color}>{settings.name}</Badge>
                <Badge variant="outline">{CHALLENGE_TYPES[challengeType].name}</Badge>
              </div>
              <div className="flex items-center gap-4">
                {timeRemaining !== null && (
                  <div className={`flex items-center gap-1 font-mono text-lg ${timeRemaining <= 10 ? "text-red-500 animate-pulse" : ""}`}>
                    <Timer className="h-5 w-5" />
                    {timeRemaining}s
                  </div>
                )}
                <Badge variant="outline">
                  {currentQuizIndex + 1} / {availableQuizzes.length}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{score} pts</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Flame className={`h-4 w-4 ${streak > 0 ? "text-orange-500" : ""}`} />
                  {t('games.common.streak')}: {streak}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">{t('games.common.hints')}: {hintsRemaining}</div>
              </div>
            </div>

            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Challenge Card */}
        <Card className="mb-6">
          <CardHeader>
            {/* Hide story title for "identify" challenge - that's what the player needs to guess! */}
            {challengeType === "identify" ? (
              <CardTitle className="text-xl">{t('games.storyRoom.whichStory')}</CardTitle>
            ) : (
              <>
                <CardTitle className="text-xl">{currentQuiz.story}</CardTitle>
                {settings.showBookReference && (
                  <CardDescription>{currentQuiz.book}</CardDescription>
                )}
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sequence Challenge */}
            {challengeType === "sequence" && (
              <>
                <div>
                  <h3 className="font-semibold mb-3">{t('games.storyRoom.yourSequence')}:</h3>
                  <div className="min-h-[120px] p-4 border-2 border-dashed rounded-lg bg-muted/50">
                    {userSequence.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        {t('games.storyRoom.clickScenes')}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {userSequence.map((scene, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-background rounded-lg border"
                          >
                            <span className="flex items-center gap-3">
                              <Badge variant="outline">{index + 1}</Badge>
                              {scene}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveScene(index)}
                            >
                              {t('games.common.remove')}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">{t('games.storyRoom.availableScenes')}:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableScenes.map((scene) => (
                      <Button
                        key={scene}
                        variant="outline"
                        className="h-auto py-4 justify-start text-left"
                        onClick={() => handleSceneClick(scene)}
                      >
                        {scene}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Identify/Missing/Character/Book Challenges */}
            {challengeType !== "sequence" && (
              <>
                {challengeType === "identify" && (
                  <div>
                    <h3 className="font-semibold mb-3">{t('games.storyRoom.whichStoryScenes')}</h3>
                    <div className="space-y-2 mb-4 p-4 bg-muted/50 rounded-lg">
                      {availableScenes.map((scene, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Badge variant="outline">{idx + 1}</Badge>
                          <span>{scene}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {challengeType === "missing" && (
                  <div>
                    <h3 className="font-semibold mb-3">{t('games.storyRoom.whichSceneMissing')}</h3>
                    <div className="space-y-2 mb-4 p-4 bg-muted/50 rounded-lg">
                      {availableScenes.map((scene, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Badge variant="outline">{idx + 1}</Badge>
                          <span className={scene === "???" ? "text-primary font-bold" : ""}>
                            {scene}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {challengeType === "character" && (
                  <div>
                    <h3 className="font-semibold mb-3">{t('games.storyRoom.whichCharacter', { story: currentQuiz.story })}</h3>
                  </div>
                )}

                {challengeType === "book" && (
                  <div>
                    <h3 className="font-semibold mb-3">{t('games.storyRoom.whichBook', { story: currentQuiz.story })}</h3>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {answerOptions.map((option) => (
                    <Button
                      key={option}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className="h-auto py-4 justify-start text-left"
                      onClick={() => handleAnswerSelect(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </>
            )}

            {/* Hint */}
            {showHint && (
              <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-300">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <HelpCircle className="h-5 w-5" />
                  <span className="font-medium">Hint: {getHintText()}</span>
                </div>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                feedback.includes("Correct")
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}>
                {feedback.includes("Correct") ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
                <span className="font-medium">{feedback}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={checkAnswer}
                disabled={
                  (challengeType === "sequence" && userSequence.length !== Math.min(currentQuiz.sequence.length, settings.maxScenes)) ||
                  (challengeType !== "sequence" && !selectedAnswer)
                }
                className="flex-1"
                size="lg"
              >
                {t('games.common.checkAnswer')}
              </Button>

              {hintsRemaining > 0 && !showHint && (
                <Button onClick={useHint} variant="outline" size="lg">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  {t('games.common.hint')} ({hintsRemaining})
                </Button>
              )}

              <Button onClick={skipQuiz} variant="ghost" size="lg">
                {t('games.common.skip')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">{t('games.storyRoom.tipTitle')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('games.storyRoom.tipContent')}
            </p>
          </CardContent>
        </Card>
      </main>
      <FloatingGameChat gameType="story-room" />
    </div>
  );
}
