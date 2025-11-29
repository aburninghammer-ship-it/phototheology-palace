import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Castle, 
  Brain, 
  Puzzle, 
  Star, 
  Trophy,
  BookOpen,
  Palette,
  Music,
  Map,
  ArrowRight,
  Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface KidsGame {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  ageRange: string;
  difficulty: "easy" | "medium" | "hard";
  unlocked: boolean;
  progress: number;
  category: "palace" | "memory" | "creative" | "adventure";
}

const KIDS_GAMES: KidsGame[] = [
  {
    id: "palace-explorer",
    title: "Palace Explorer",
    description: "Walk through the 8 floors of the Phototheology Palace!",
    icon: Castle,
    color: "from-purple-500 to-indigo-500",
    ageRange: "6-12",
    difficulty: "easy",
    unlocked: true,
    progress: 0,
    category: "palace"
  },
  {
    id: "verse-match",
    title: "Verse Match Adventure",
    description: "Match Bible verses to their pictures!",
    icon: Puzzle,
    color: "from-pink-500 to-rose-500",
    ageRange: "5-10",
    difficulty: "easy",
    unlocked: true,
    progress: 0,
    category: "memory"
  },
  {
    id: "story-builder",
    title: "Bible Story Builder",
    description: "Put Bible stories in order with fun pictures!",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
    ageRange: "6-12",
    difficulty: "medium",
    unlocked: true,
    progress: 0,
    category: "memory"
  },
  {
    id: "room-painter",
    title: "Room Painter",
    description: "Color and decorate Palace rooms with Bible scenes!",
    icon: Palette,
    color: "from-orange-500 to-amber-500",
    ageRange: "4-8",
    difficulty: "easy",
    unlocked: true,
    progress: 0,
    category: "creative"
  },
  {
    id: "verse-songs",
    title: "Verse Songs",
    description: "Learn memory verses through fun songs!",
    icon: Music,
    color: "from-cyan-500 to-teal-500",
    ageRange: "4-10",
    difficulty: "easy",
    unlocked: true,
    progress: 0,
    category: "creative"
  },
  {
    id: "treasure-map",
    title: "Bible Treasure Map",
    description: "Find hidden treasures by answering Bible questions!",
    icon: Map,
    color: "from-yellow-500 to-orange-500",
    ageRange: "7-12",
    difficulty: "medium",
    unlocked: true,
    progress: 0,
    category: "adventure"
  },
  {
    id: "pattern-quest",
    title: "Pattern Quest",
    description: "Discover Bible patterns like a detective!",
    icon: Brain,
    color: "from-blue-500 to-violet-500",
    ageRange: "8-12",
    difficulty: "hard",
    unlocked: false,
    progress: 0,
    category: "palace"
  },
  {
    id: "type-hunter",
    title: "Type Hunter",
    description: "Find how Old Testament stories point to Jesus!",
    icon: Star,
    color: "from-red-500 to-pink-500",
    ageRange: "9-12",
    difficulty: "hard",
    unlocked: false,
    progress: 0,
    category: "palace"
  },
];

export default function PTKidsGames() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Games", icon: Sparkles },
    { id: "palace", label: "Palace", icon: Castle },
    { id: "memory", label: "Memory", icon: Brain },
    { id: "creative", label: "Creative", icon: Palette },
    { id: "adventure", label: "Adventure", icon: Map },
  ];

  const filteredGames = selectedCategory === "all" 
    ? KIDS_GAMES 
    : KIDS_GAMES.filter(g => g.category === selectedCategory);

  const getDifficultyColor = (difficulty: KidsGame["difficulty"]) => {
    switch (difficulty) {
      case "easy": return "bg-green-500";
      case "medium": return "bg-amber-500";
      case "hard": return "bg-red-500";
    }
  };

  const handleGameClick = (game: KidsGame) => {
    if (!game.unlocked) return;
    navigate(`/pt-kids-game/${game.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-12 w-12 text-yellow-500 animate-pulse" />
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  PT Kids Zone!
                </h1>
                <Sparkles className="h-12 w-12 text-yellow-500 animate-pulse" />
              </div>
            </motion.div>
            <p className="text-xl text-muted-foreground">
              Learn the Bible Palace through fun games! 🎮✨
            </p>
            
            {/* Quick stats */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400">
                <Star className="h-4 w-4 mr-2" />
                0 Stars Earned
              </Badge>
              <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-400">
                <Trophy className="h-4 w-4 mr-2" />
                Level 1
              </Badge>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Games grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game, index) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`h-full cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-4 ${
                      game.unlocked ? "border-transparent" : "border-gray-300 opacity-75"
                    }`}
                    onClick={() => handleGameClick(game)}
                  >
                    <div className={`h-2 bg-gradient-to-r ${game.color}`} />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${game.color}`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        {!game.unlocked && (
                          <Lock className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <CardTitle className="text-xl mt-3">{game.title}</CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">Ages {game.ageRange}</Badge>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${getDifficultyColor(game.difficulty)}`} />
                            <span className="text-xs text-muted-foreground capitalize">{game.difficulty}</span>
                          </div>
                        </div>
                        
                        {game.unlocked && (
                          <>
                            <Progress value={game.progress} className="h-2" />
                            <Button className="w-full gap-2" variant="outline">
                              Play Now
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {!game.unlocked && (
                          <div className="text-center text-sm text-muted-foreground">
                            Complete easier games to unlock!
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Talk to Kid PTGPT */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-300">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="text-6xl">🤖</div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold">Ask Kid Jeeves!</h3>
                  <p className="text-muted-foreground">
                    Have questions about the Bible? Kid Jeeves explains everything in fun, easy ways!
                  </p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => navigate("/kid-gpt")}
                  className="bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Talk to Kid Jeeves
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
