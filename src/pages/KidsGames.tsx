import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

const KidsGames = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const youngKidsGames = [
    { id: "palace_explorer", name: "🏰 Palace Explorer", description: "Go on an adventure through the 9 rooms! Meet friendly characters and learn what makes each room special.", icon: "🗺️" },
    { id: "verse_memory", name: "🎴 Verse Memory Match", description: "Flip cards to match Bible verses! Find pairs and learn simple verses by heart.", icon: "🧠" },
    { id: "color_prophet", name: "🎨 Color the Prophets", description: "Color pictures of Bible heroes like Daniel, Moses, and David while learning their stories.", icon: "✏️" },
    { id: "palace_builder", name: "🏗️ Palace Builder", description: "Build your very own memory palace! Place pictures in rooms to remember your favorite verses.", icon: "🏛️" },
    { id: "story_time", name: "📖 Story Time", description: "Listen to exciting Bible stories with colorful pictures and fun sound effects!", icon: "🎵" },
  ];

  const middleKidsGames = [
    { id: "principle_detective", name: "🔍 Principle Detective", description: "Solve mysteries by finding which Palace principle is hidden in each Bible verse. Use clues from Jeeves!", icon: "🕵️" },
    { id: "palace_race", name: "🏃 Palace Race", description: "Race through all 9 floors of the Palace! Answer questions quickly to reach the top first.", icon: "⚡" },
    { id: "jeeves_helper", name: "🤖 Jeeves' Helper", description: "Help Jeeves organize verses into the correct rooms. Learn why each verse belongs where it does.", icon: "🎓" },
    { id: "verse_builder", name: "🧩 Verse Builder", description: "Complete Bible verses by filling in the missing words. Start easy and unlock harder challenges!", icon: "📝" },
    { id: "timeline_adventure", name: "⏰ Timeline Adventure", description: "Travel through Bible history! Put events in the right order from Creation to Jesus and beyond.", icon: "📅" },
  ];

  const olderKidsGames = [
    { id: "chain_junior", name: "⛓️ Chain Chess Junior", description: "Build chains of connected Bible verses. Compete with Jeeves to create the longest biblical connections!", icon: "🔗" },
    { id: "palace_master", name: "👑 Palace Master", description: "Master all 50 principles across the 9 rooms. Complete challenges to earn your Palace Master badge!", icon: "🏆" },
    { id: "prophecy_puzzle", name: "🔮 Prophecy Puzzle", description: "Connect Old Testament prophecies with their New Testament fulfillments. Unlock the prophetic timeline!", icon: "📜" },
    { id: "principle_challenge", name: "💪 Principle Challenge", description: "Take on advanced challenges matching complex verses to multiple principles. Think deeply!", icon: "🧠" },
    { id: "study_creator", name: "✍️ Study Creator", description: "Create your own Bible study guides using Palace principles. Share them with friends!", icon: "📚" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3">
              <Sparkles className="h-12 w-12 text-purple-500 animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Kids Games
              </h1>
              <Sparkles className="h-12 w-12 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fun games to learn about the Bible and the Memory Palace! Choose your age group to get started. 🎮
            </p>
          </div>

          <Tabs defaultValue="6-9" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="6-9">Ages 6-9</TabsTrigger>
              <TabsTrigger value="10-12">Ages 10-12</TabsTrigger>
              <TabsTrigger value="13-15">Ages 13-15</TabsTrigger>
            </TabsList>

            <TabsContent value="6-9" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {youngKidsGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="text-4xl mb-2 text-center">{game.icon}</div>
                      <CardTitle className="text-center">{game.name}</CardTitle>
                      <CardDescription className="text-center min-h-[60px]">{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => navigate(`/kids-games/${game.id}`)} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Play Now! 🎮
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="10-12" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {middleKidsGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="text-4xl mb-2 text-center">{game.icon}</div>
                      <CardTitle className="text-center">{game.name}</CardTitle>
                      <CardDescription className="text-center min-h-[60px]">{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => navigate(`/kids-games/${game.id}`)} className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
                        Play Now! 🎯
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="13-15" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {olderKidsGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="text-4xl mb-2 text-center">{game.icon}</div>
                      <CardTitle className="text-center">{game.name}</CardTitle>
                      <CardDescription className="text-center min-h-[60px]">{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => navigate(`/kids-games/${game.id}`)} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                        Play Now! 🚀
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default KidsGames;
