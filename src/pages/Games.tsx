import { useEffect, useState } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { GAMES_TOUR } from "@/data/guidedTours";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Gamepad2, MapPin, UsersRound, Search, Trophy, Users, BookOpen } from "lucide-react";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { GameNightInviteDialog } from "@/components/games/GameNightInviteDialog";
import { gamesSteps } from "@/config/howItWorksSteps";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { ChainChessLeaderboard, GroupEscapeRoom } from "@/components/social";
import { UnifiedGameRankings } from "@/components/games/UnifiedGameRankings";
import { ActiveGameSessions } from "@/components/games/ActiveGameSessions";
import { usePreservePageState, usePreserveFormState } from "@/contexts/PageStateContext";

// Games with special badges
const NEW_GAMES = ["pt_tetris", "symbol_decoder", "speed_verse", "gideon_300", "freestyle_zone"]; // Completely new games
const RENOVATED_GAMES = ["chain_chess", "escape_room"]; // Rebuilt/improved games

// Bible translations available for games
const BIBLE_TRANSLATIONS = [
  { id: "kjv", name: "KJV", description: "King James Version" },
  { id: "nkjv", name: "NKJV", description: "New King James Version" },
  { id: "niv", name: "NIV", description: "New International Version" },
  { id: "esv", name: "ESV", description: "English Standard Version" },
  { id: "nasb", name: "NASB", description: "New American Standard Bible" },
  { id: "nlt", name: "NLT", description: "New Living Translation" },
  { id: "amp", name: "AMP", description: "Amplified Bible" },
  { id: "msg", name: "MSG", description: "The Message" },
];

const Games = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tourOpen, setTourOpen] = useState(false);

  // Preserve page state across navigation
  usePreservePageState();
  const [formState, updateFormState] = usePreserveFormState({
    searchQuery: "",
    floorFilter: "all",
    viewMode: "all" as "all" | "floor" | "mode",
  });

  const { searchQuery, floorFilter, viewMode } = formState;
  const setSearchQuery = (val: string) => updateFormState({ searchQuery: val });
  const setFloorFilter = (val: string) => updateFormState({ floorFilter: val });
  const setViewMode = (val: "all" | "floor" | "mode") => updateFormState({ viewMode: val });

  const [selectedTranslation, setSelectedTranslation] = useState(() => {
    // Load from localStorage or default to KJV
    return localStorage.getItem("games_bible_translation") || "kjv";
  });

  // Save translation preference
  const handleTranslationChange = (translation: string) => {
    setSelectedTranslation(translation);
    localStorage.setItem("games_bible_translation", translation);
    toast({
      title: "Translation Updated",
      description: `Games will now use ${BIBLE_TRANSLATIONS.find(t => t.id === translation)?.name || translation}`,
    });
  };

  const allGames = [
    {
      id: "gideon_300",
      name: "Gideon 300 Tournament",
      description: "Live multiplayer elimination tournament. Start with 300, refine to the remnant through progressive rounds. Two strikes and you're in Camp Mode!",
      icon: "⚔️",
      floor: 0,
      timed: true,
      rooms: ["All"],
      modes: ["multiplayer"],
      difficulties: ["medium", "hard", "expert"],
      route: "/games/gideon-300"
    },
    {
      id: "master_exam",
      name: "Test Me: Master Exam",
      description: "50 AI-generated questions across all Palace domains. Timed 90-minute comprehensive assessment with AI grading. Never the same twice!",
      icon: "\uD83C\uDF93",
      floor: 0,
      timed: true,
      rooms: ["All"],
      modes: ["solo"],
      difficulties: ["hard", "expert"],
      route: "/games/master-exam"
    },
    {
      id: "story_room",
      name: "Story Room Challenge",
      description: "Arrange biblical stories in sequence. Master the Story Room by turning events into vivid mental movies!",
      icon: "📚",
      floor: 1,
      timed: false,
      rooms: ["SR"],
      modes: ["solo"],
      difficulties: ["easy", "medium", "hard"],
      route: "/games/story-room"
    },
    {
      id: "palace_cards",
      name: "Parallels Match",
      description: "Match biblical parallels across Scripture! Discover how events echo each other: Elijah→Elisha, Jonah→Jesus, Passover→Calvary.",
      icon: "🔗",
      floor: 4,
      timed: false,
      rooms: ["P‖"],
      modes: ["solo", "2p"],
      difficulties: ["medium", "hard"],
      route: "/games/palace-cards"
    },
    {
      id: "speed_verse",
      name: "Speed Verse Recall",
      description: "Memorize verses quickly and recall them under time pressure. How many can you remember?",
      icon: "⚡",
      floor: 1,
      timed: true,
      rooms: ["BR"],
      modes: ["solo"],
      difficulties: ["easy", "medium", "hard", "expert"],
      route: "/games/speed-verse-3d"
    },
    {
      id: "principle-cards",
      name: "Principle Cards",
      description: "Multiplayer card game where principles become cards! Match them to scenarios and compete.",
      icon: "🎴",
      floor: 4,
      timed: false,
      rooms: ["All"],
      modes: ["multiplayer"],
      difficulties: ["medium"],
      route: "/games/principle-cards"
    },
    {
      id: "observation_room",
      name: "Observation Flux",
      description: "Verb blocks fall as you type observations. See what is actually there — observe only, do not interpret!",
      icon: "👁️",
      floor: 2,
      timed: true,
      rooms: ["OR"],
      modes: ["solo"],
      difficulties: ["easy", "medium", "hard"],
      route: "/games/observation-room"
    },
    {
      id: "symbol_decoder",
      name: "Symbol Decoder",
      description: "Match biblical symbols to their meanings. Unlock typology patterns!",
      icon: "🔣",
      floor: 2,
      timed: false,
      rooms: ["ST", "CR"],
      modes: ["solo", "vs-ai", "2p"],
      difficulties: ["easy", "medium", "hard"],
      route: "/games/symbol-decoder"
    },
    {
      id: "chef_challenge",
      name: "🍳 THE CHEF CHALLENGE",
      description: "Create a 'biblical recipe' – a mini-sermon using ONLY Bible verse references!",
      icon: "🍳",
      floor: 3,
      timed: true,
      rooms: ["SR", "CR", "QA", "BF"],
      modes: ["solo", "multiplayer"],
      difficulties: ["medium", "hard"],
      route: "/games/chef-challenge"
    },
    {
      id: "concentration_room",
      name: "Concentration Room: Find Christ",
      description: "Every passage must reveal Christ. Use your magnifying glass to see Jesus in all Scripture!",
      icon: "✝️",
      floor: 4,
      timed: false,
      rooms: ["CR"],
      modes: ["solo"],
      difficulties: ["medium", "hard"],
      route: "/games/concentration-room"
    },
    {
      id: "dimensions_room",
      name: "Five Dimensions Challenge",
      description: "View verses like a diamond under five lights: Literal, Christ, Me, Church, Heaven!",
      icon: "💎",
      floor: 4,
      timed: false,
      rooms: ["DR"],
      modes: ["solo"],
      difficulties: ["medium", "hard"],
      route: "/games/dimensions-room"
    },
    {
      id: "blue_room",
      name: "Sanctuary Blueprint Master",
      description: "Match sanctuary articles to their gospel meanings. Master God's blueprint of salvation!",
      icon: "⛪",
      floor: 5,
      timed: false,
      rooms: ["BL"],
      modes: ["solo"],
      difficulties: ["easy", "medium", "hard"],
      route: "/games/blue-room"
    },
    {
      id: "chain_war",
      name: "⚡ QUICK PLAY",
      description: "Fast card-based rounds — pick PT symbols, cite a verse, explain the chain. Reach 15 points to win!",
      icon: "⚡",
      floor: 4,
      timed: true,
      rooms: ["QR", "QA", "CR", "DR"],
      modes: ["solo", "vs-ai", "2p"],
      difficulties: ["medium", "hard", "expert"],
      route: "/pt-scrabble?mode=quick"
    },
    {
      id: "concentration",
      name: "Biblical Parallels Match",
      description: "Match Old Testament events with their New Testament fulfillments!",
      icon: "🎴",
      floor: 4,
      timed: false,
      rooms: ["ST", "P‖", "CR"],
      modes: ["solo", "vs-ai", "2p"],
      difficulties: ["easy", "medium", "hard"],
      route: "/games/concentration"
    },
    {
      id: "sanctuary_run",
      name: "⛪ SANCTUARY RUN",
      description: "Tell the gospel story through 3 random sanctuary items in order!",
      icon: "⛪",
      floor: 5,
      timed: true,
      rooms: ["BL", "CR", "SR"],
      modes: ["solo", "vs-ai", "2p"],
      difficulties: ["medium", "hard"],
      route: "/games/sanctuary-run"
    },
    {
      id: "prophecy_timeline",
      name: "Prophecy Timeline",
      description: "Place biblical prophecies and their fulfillments on the correct timeline!",
      icon: "📜",
      floor: 5,
      timed: false,
      rooms: ["PR", "TZ", "FR"],
      modes: ["solo", "vs-ai"],
      difficulties: ["medium", "hard", "expert"],
      route: "/training-drills"
    },
    {
      id: "time_zone_invasion",
      name: "🌍 TIME ZONE INVASION",
      description: "Pick 2 time zones for a verse and defend your prophetic framing!",
      icon: "🌍",
      floor: 6,
      timed: true,
      rooms: ["TZ", "PR", "FR"],
      modes: ["solo", "vs-ai", "2p"],
      difficulties: ["hard", "expert"],
      route: "/games/time-zone-invasion"
    },
    {
      id: "branch_study",
      name: "📖 BRANCHSTUDY",
      description: "Interactive branching Bible study with cross-references and Palace principles",
      icon: "📖",
      floor: 0,
      timed: false,
      rooms: ["All"],
      modes: ["solo"],
      difficulties: ["medium"],
      route: "/branch-study"
    },
    {
      id: "christ_lock",
      name: "✝️ CHRIST LOCK",
      description: "Draw a Christ-focus card, get a random verse, explain how it reveals Jesus!",
      icon: "✝️",
      floor: 4,
      timed: false,
      rooms: ["CR", "ST", "DR"],
      modes: ["solo", "vs-ai"],
      difficulties: ["medium", "hard"],
      route: "/games/christ-lock"
    },
    {
      id: "escape_dragon",
      name: "🐉 ESCAPE THE DRAGON",
      description: "Co-op end-time survival. Face attacks and defend theologically!",
      icon: "🐉",
      floor: 7,
      timed: true,
      rooms: ["PR", "3A", "TZ", "BL"],
      modes: ["solo", "2p"],
      difficulties: ["hard", "expert"],
      route: "/games/escape-dragon"
    },
    {
      id: "chain_chess",
      name: "Chain Chess",
      description: "Build biblical commentary chains connecting verses, principles, and Palace rooms!",
      icon: "♟️",
      floor: 4,
      timed: false,
      rooms: ["QR", "QA", "CR", "DR", "ST"],
      modes: ["solo", "vs-ai", "2p"],
      difficulties: ["medium", "hard", "expert"],
      route: "/games/chain-chess/new"
    },
    {
      id: "escape_room",
      name: "🚪 Escape Room",
      description: "Solve biblical puzzles and connect verses to escape! Use Palace principles to unlock the door.",
      icon: "🚪",
      floor: 4,
      timed: true,
      rooms: ["All"],
      modes: ["solo", "2p"],
      difficulties: ["medium", "hard", "expert"],
      route: "/escape-room"
    },
    {
      id: "treasure_hunt",
      name: "🗺️ Treasure Hunt",
      description: "Follow biblical clues across Scripture to find hidden treasures! Each clue leads to the next.",
      icon: "🗺️",
      floor: 3,
      timed: false,
      rooms: ["SR", "QR", "QA"],
      modes: ["solo"],
      difficulties: ["easy", "medium", "hard"],
      route: "/treasure-hunt"
    },
    {
      id: "principle_sprint",
      name: "⚡ Principle Sprint",
      description: "Speed-based game to identify PT principles quickly! Select all correct principles for each verse before time runs out.",
      icon: "⚡",
      floor: 4,
      timed: true,
      rooms: ["DR", "TZ", "CR"],
      modes: ["solo"],
      difficulties: ["medium", "hard", "expert"],
      route: "/games/principle-sprint"
    },
    {
      id: "phototheology_uno",
      name: "🃏 Phototheology Uno",
      description: "Biblical connections card game! Race to empty your hand by drawing meaningful theological connections. Jeeves judges your plays!",
      icon: "🃏",
      floor: 4,
      timed: false,
      rooms: ["CR", "P‖", "ST", "DR"],
      modes: ["solo", "2p", "multiplayer"],
      difficulties: ["easy", "medium"],
      route: "/games/phototheology-uno"
    },
    {
      id: "pt_scrabble",
      name: "🎯 PT Scrabble",
      description: "Build theological connections on a shared board! Place Palace room cards adjacent to existing ones and explain your Christ-centered connections.",
      icon: "🎯",
      floor: 0,
      timed: false,
      rooms: ["All"],
      modes: ["solo", "multiplayer"],
      difficulties: ["easy", "medium"],
      route: "/pt-scrabble"
    },
    {
      id: "group_study",
      name: "📖 Group Bible Study",
      description: "Real-time collaborative Bible study! Share insights, vote on contributions, and earn points for Christ-centered connections.",
      icon: "📖",
      floor: 0,
      timed: true,
      rooms: ["All"],
      modes: ["multiplayer"],
      difficulties: ["easy"],
      route: "/group-study"
    },
    {
      id: "freestyle_zone",
      name: "The Freestyler Training Zone",
      description: "Train your theological reflexes! Jeeves drops random prompts from Scripture, nature, history, and everyday life. Connect each drop to Christ and build chains under pressure. Features momentum scoring, difficulty tiers, and session export.",
      icon: "🎤",
      floor: 3,
      timed: true,
      rooms: ["FR", "All"],
      modes: ["solo"],
      difficulties: ["easy", "medium", "hard", "expert"],
      route: "/games/freestyle-zone"
    },
    {
      id: "pt_jeopardy",
      name: "🧠 PT Jeopardy",
      description: "Test your Bible knowledge Jeopardy-style! Pick categories from PT Rooms, answer AI-generated questions, and earn bonus points for Scripture citations and Christ connections.",
      icon: "🧠",
      floor: 0,
      timed: true,
      rooms: ["All"],
      modes: ["solo", "multiplayer"],
      difficulties: ["easy", "medium", "hard"],
      route: "/games/pt-jeopardy"
    },
    {
      id: "pt_family_feud",
      name: "👨‍👩‍👧‍👦 PT Family Feud",
      description: "Team-based Bible trivia! Two teams compete to guess the top-ranked answers to theological survey questions. Includes a Forge a Weapon championship round!",
      icon: "👨‍👩‍👧‍👦",
      floor: 0,
      timed: true,
      rooms: ["All"],
      modes: ["multiplayer"],
      difficulties: ["easy", "medium"],
      route: "/games/pt-family-feud"
    },
  ];

  const filteredGames = allGames.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFloor = floorFilter === "all" || game.floor.toString() === floorFilter;
    return matchesSearch && matchesFloor;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "hard": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      case "expert": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default: return "";
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "solo": return "👤 Solo";
      case "vs-ai": return "🤖 vs AI";
      case "2p": return "👥 2P";
      default: return mode;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-x-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading games...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Animated Background - Simplified on mobile */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="hidden md:block absolute top-1/2 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Navigation />
      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8 pb-24 md:pb-8 max-w-7xl relative z-10">
        {/* Header with How to Use - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-start md:items-center mb-4 md:mb-6"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <img
              src="/pwa-192x192.png"
              alt="Phototheology"
              className="h-10 w-10 md:h-12 md:w-12 rounded-xl shadow-lg shadow-primary/20"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Games
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">Learn through play</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
              <Gamepad2 className="h-4 w-4" /> Guided Tour
            </Button>
            <GameNightInviteDialog />
            <HowItWorksDialog title="How to Use Games" steps={gamesSteps} />
          </div>
        </motion.div>
        {tourOpen && <GuidedTourOverlay steps={GAMES_TOUR} onClose={() => setTourOpen(false)} />}
        
        {/* Search and Filter Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              className="pl-10 h-12 text-base backdrop-blur-sm bg-background/50 border-border/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={floorFilter} onValueChange={setFloorFilter}>
            <SelectTrigger className="w-full md:w-[200px] h-12 text-base backdrop-blur-sm bg-background/50 border-border/50">
              <SelectValue placeholder="All Floors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Floors</SelectItem>
              <SelectItem value="1">Floor 1</SelectItem>
              <SelectItem value="2">Floor 2</SelectItem>
              <SelectItem value="3">Floor 3</SelectItem>
              <SelectItem value="4">Floor 4</SelectItem>
              <SelectItem value="5">Floor 5</SelectItem>
              <SelectItem value="6">Floor 6</SelectItem>
              <SelectItem value="7">Floor 7</SelectItem>
              <SelectItem value="8">Floor 8</SelectItem>
            </SelectContent>
          </Select>

          {/* Bible Translation Selector */}
          <Select value={selectedTranslation} onValueChange={handleTranslationChange}>
            <SelectTrigger className="w-full md:w-[180px] h-12 text-base backdrop-blur-sm bg-background/50 border-border/50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <SelectValue placeholder="Translation" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1">
                Select Bible Translation
              </div>
              {BIBLE_TRANSLATIONS.map((translation) => (
                <SelectItem key={translation.id} value={translation.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{translation.name}</span>
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      - {translation.description}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <VoiceChatWidget
              roomType="games"
              roomId="lobby"
              className="mb-6"
            />
          </motion.div>
        )}

        {/* Continue Playing Section */}
        {user && <ActiveGameSessions />}

        {/* View Mode Tabs - Horizontally scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 md:gap-4 mb-6 md:mb-8 overflow-x-auto pb-2 scrollbar-hide"
        >
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            className={`h-11 md:h-14 text-sm md:text-base transition-all duration-300 flex-shrink-0 ${viewMode === "all" ? "gradient-palace shadow-elegant" : "backdrop-blur-sm bg-background/50 hover:bg-primary/10"}`}
            onClick={() => setViewMode("all")}
          >
            <Gamepad2 className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
            All
          </Button>
          <Button
            variant={viewMode === "floor" ? "default" : "outline"}
            className={`h-11 md:h-14 text-sm md:text-base transition-all duration-300 flex-shrink-0 ${viewMode === "floor" ? "gradient-palace shadow-elegant" : "backdrop-blur-sm bg-background/50 hover:bg-primary/10"}`}
            onClick={() => setViewMode("floor")}
          >
            <MapPin className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
            By Floor
          </Button>
          <Button
            variant={viewMode === "mode" ? "default" : "outline"}
            className={`h-11 md:h-14 text-sm md:text-base transition-all duration-300 flex-shrink-0 ${viewMode === "mode" ? "gradient-palace shadow-elegant" : "backdrop-blur-sm bg-background/50 hover:bg-primary/10"}`}
            onClick={() => setViewMode("mode")}
          >
            <UsersRound className="mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
            By Mode
          </Button>
        </motion.div>


        {/* Games Grid - Responsive with 1 col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(0.05 * index, 0.3) }}
            >
              <Card
                variant="glass"
                className="hover:shadow-elegant transition-all duration-300 cursor-pointer group overflow-hidden active:scale-[0.98] md:hover:-translate-y-1"
                onClick={() => navigate(game.route)}
              >
                <CardContent className="p-4 md:p-6">
                  {/* Top Row: Icon and Badges */}
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">{game.icon}</div>
                    <div className="flex flex-col items-end gap-1.5 md:gap-2">
                      <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-[10px] md:text-xs">
                        Floor {game.floor}
                      </Badge>
                      {game.timed && (
                        <Badge variant="outline" className="border-orange-500/50 text-orange-600 dark:border-orange-400/50 dark:text-orange-400 bg-orange-500/10 text-[10px] md:text-xs">
                          ⏱️ Timed
                        </Badge>
                      )}
                      {NEW_GAMES.includes(game.id) && (
                        <Badge className="bg-green-500 text-white border-green-600 text-[10px] md:text-xs animate-pulse">
                          ✨ New
                        </Badge>
                      )}
                      {RENOVATED_GAMES.includes(game.id) && (
                        <Badge className="bg-amber-500 text-white border-amber-600 text-[10px] md:text-xs animate-pulse">
                          🔧 Renovated
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2 group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 line-clamp-2">
                    {game.description}
                  </p>

                  {/* Room Codes and Modes - Combined row on mobile */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
                    {game.rooms.slice(0, 3).map((room) => (
                      <Badge key={room} variant="secondary" className="text-[10px] md:text-xs font-mono bg-accent/20 border-accent/30">
                        {room}
                      </Badge>
                    ))}
                    {game.rooms.length > 3 && (
                      <Badge variant="secondary" className="text-[10px] md:text-xs font-mono bg-accent/20 border-accent/30">
                        +{game.rooms.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Difficulty Tags */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {game.difficulties.slice(0, 3).map((difficulty) => (
                      <Badge
                        key={difficulty}
                        className={`text-[10px] md:text-xs ${getDifficultyColor(difficulty)}`}
                      >
                        {difficulty}
                      </Badge>
                    ))}
                    {game.modes.includes("2p") && (
                      <Badge variant="outline" className="text-[10px] md:text-xs backdrop-blur-sm">
                        👥 2P
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Leaderboards Section - Below games */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid md:grid-cols-3 gap-6 mt-8 mb-8"
        >
          <UnifiedGameRankings />
          <ChainChessLeaderboard />
          <GroupEscapeRoom />
        </motion.div>

        {filteredGames.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">No games found matching your filters.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Games;
