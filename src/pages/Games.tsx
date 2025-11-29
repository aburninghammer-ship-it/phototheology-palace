import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Gamepad2, MapPin, UsersRound, Search, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VoiceChatWidget } from "@/components/voice/VoiceChatWidget";
import { ChainChessLeaderboard, GroupEscapeRoom } from "@/components/social";

const Games = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [floorFilter, setFloorFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"all" | "floor" | "mode">("all");

  const allGames = [
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
      modes: ["solo"],
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
      modes: ["solo", "vs-ai", "2p"],
      difficulties: ["easy", "medium", "hard", "expert"],
      route: "/games/verse_match"
    },
    {
      id: "verse_match",
      name: "Verse Memory Match",
      description: "Match Bible verses with their references in this classic memory card game!",
      icon: "🔢",
      floor: 1,
      timed: true,
      rooms: ["BR"],
      modes: ["solo", "custom"],
      difficulties: ["easy", "medium", "hard"],
      route: "/games/verse_match"
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
      name: "Observation Detective",
      description: "Spot hidden details in Scripture passages. Train your investigative eye like a detective!",
      icon: "🔍",
      floor: 2,
      timed: false,
      rooms: ["OR"],
      modes: ["solo"],
      difficulties: ["easy", "medium", "hard"],
      route: "/games/observation-room"
    },
    {
      id: "symbol_decoder",
      name: "Symbol Decoder",
      description: "Match biblical symbols to their meanings. Unlock typology patterns!",
      icon: "🎯",
      floor: 2,
      timed: false,
      rooms: ["ST", "CR"],
      modes: ["solo", "vs-ai", "2p"],
      difficulties: ["easy", "medium", "hard"],
      route: "/training-drills"
    },
    {
      id: "chef_challenge",
      name: "🍳 THE CHEF CHALLENGE",
      description: "Create a 'biblical recipe' – a mini-sermon using ONLY Bible verse references!",
      icon: "🍳",
      floor: 3,
      timed: true,
      rooms: ["SR", "CR", "QA", "BF"],
      modes: ["solo"],
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
      name: "⛓️ CHAIN WAR",
      description: "Build biblical commentary chains using PT symbols. Jeeves validates your connections!",
      icon: "⛓️",
      floor: 4,
      timed: true,
      rooms: ["QR", "QA", "CR", "DR"],
      modes: ["solo", "vs-ai", "2p"],
      difficulties: ["medium", "hard", "expert"],
      route: "/games/chain-war"
    },
    {
      id: "concentration",
      name: "Biblical Parallels Match",
      description: "Match Old Testament events with their New Testament fulfillments!",
      icon: "🎴",
      floor: 4,
      timed: false,
      rooms: ["ST", "P‖", "CR"],
      modes: ["solo", "vs-ai"],
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
      id: "connection_dash",
      name: "🔗 Connection Dash",
      description: "Speed game to connect verses and explore interpretations! Find all verses that connect to the main verse quickly.",
      icon: "🔗",
      floor: 4,
      timed: true,
      rooms: ["BF", "P‖", "QR", "QA"],
      modes: ["solo"],
      difficulties: ["medium", "hard", "expert"],
      route: "/games/connection-dash"
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading games...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search and Filter Header */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              className="pl-10 h-12 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={floorFilter} onValueChange={setFloorFilter}>
            <SelectTrigger className="w-full md:w-[200px] h-12 text-base">
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
        </div>

        {user && (
          <VoiceChatWidget
            roomType="games"
            roomId="lobby"
            className="mb-6"
          />
        )}

        {/* View Mode Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Button
            variant={viewMode === "all" ? "default" : "outline"}
            className="h-14 text-base"
            onClick={() => setViewMode("all")}
          >
            <Gamepad2 className="mr-2 h-5 w-5" />
            All Games
          </Button>
          <Button
            variant={viewMode === "floor" ? "default" : "outline"}
            className="h-14 text-base"
            onClick={() => setViewMode("floor")}
          >
            <MapPin className="mr-2 h-5 w-5" />
            By Floor
          </Button>
          <Button
            variant={viewMode === "mode" ? "default" : "outline"}
            className="h-14 text-base"
            onClick={() => setViewMode("mode")}
          >
            <UsersRound className="mr-2 h-5 w-5" />
            By Mode
          </Button>
        </div>

        {/* Multiplayer Features Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ChainChessLeaderboard />
          <GroupEscapeRoom />
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <Card
              key={game.id}
              className="hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
              onClick={() => navigate(game.route)}
            >
              <CardContent className="p-6">
                {/* Top Row: Icon and Badges */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{game.icon}</div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      Floor {game.floor}
                    </Badge>
                    {game.timed && (
                      <Badge variant="outline" className="border-orange-500 text-orange-600 dark:border-orange-400 dark:text-orange-400">
                        ⏱️ Timed
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {game.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {game.description}
                </p>

                {/* Room Codes */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {game.rooms.map((room) => (
                    <Badge key={room} variant="secondary" className="text-xs font-mono">
                      {room}
                    </Badge>
                  ))}
                </div>

                {/* Game Modes */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {game.modes.map((mode) => (
                    <Badge key={mode} variant="outline" className="text-xs">
                      {getModeIcon(mode)}
                    </Badge>
                  ))}
                </div>

                {/* Difficulty Tags */}
                <div className="flex flex-wrap gap-2">
                  {game.difficulties.map((difficulty) => (
                    <Badge
                      key={difficulty}
                      className={`text-xs ${getDifficultyColor(difficulty)}`}
                    >
                      {difficulty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No games found matching your filters.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Games;
