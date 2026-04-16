import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Construction } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const KidsGamePlay = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const gameData: Record<string, { name: string; description: string; icon: string }> = {
    palace_explorer: { name: "🏰 Palace Explorer", description: "Go on an adventure through the 9 rooms!", icon: "🗺️" },
    verse_memory: { name: "🎴 Verse Memory Match", description: "Flip cards to match Bible verses!", icon: "🧠" },
    color_prophet: { name: "🎨 Color the Prophets", description: "Color pictures of Bible heroes", icon: "✏️" },
    palace_builder: { name: "🏗️ Palace Builder", description: "Build your very own memory palace!", icon: "🏛️" },
    story_time: { name: "📖 Story Time", description: "Listen to exciting Bible stories", icon: "🎵" },
    jeeves_friend: { name: "🤖 Jeeves' Friend", description: "Help Jeeves organize Bible stories!", icon: "🎯" },
    animal_ark: { name: "🦁 Animal Ark", description: "Learn about animals in the Bible!", icon: "🐘" },
    treasure_finder: { name: "💎 Treasure Finder", description: "Find hidden gems in Bible verses!", icon: "✨" },
    song_sing: { name: "🎶 Sing & Learn", description: "Sing fun songs about Bible stories!", icon: "🎤" },
    hero_cards: { name: "🦸 Bible Heroes", description: "Collect cards of Bible heroes!", icon: "⭐" },
    principle_detective: { name: "🔍 Principle Detective", description: "Solve mysteries using Palace principles", icon: "🕵️" },
    palace_race: { name: "🏃 Palace Race", description: "Race through all 9 floors!", icon: "⚡" },
    jeeves_helper: { name: "🤖 Jeeves' Helper", description: "Help Jeeves organize verses", icon: "🎓" },
    verse_builder: { name: "🧩 Verse Builder", description: "Complete Bible verses", icon: "📝" },
    timeline_adventure: { name: "⏰ Timeline Adventure", description: "Travel through Bible history!", icon: "📅" },
    sanctuary_quest: { name: "⛪ Sanctuary Quest", description: "Explore the tabernacle!", icon: "🕯️" },
    prophecy_path: { name: "🔮 Prophecy Path", description: "Follow the path of prophecy", icon: "🗺️" },
    symbol_safari: { name: "🦅 Symbol Safari", description: "Hunt for biblical symbols!", icon: "🔍" },
    feast_festival: { name: "🎊 Feast Festival", description: "Celebrate God's feasts!", icon: "🎉" },
    parable_picker: { name: "📚 Parable Picker", description: "Match parables to meanings", icon: "💭" },
    chain_junior: { name: "⛓️ Chain Chess Junior", description: "Build chains of Bible verses", icon: "🔗" },
    palace_master: { name: "👑 Palace Master", description: "Master all 50 principles", icon: "🏆" },
    prophecy_puzzle: { name: "🔮 Prophecy Puzzle", description: "Connect prophecies", icon: "📜" },
    principle_challenge: { name: "💪 Principle Challenge", description: "Advanced principle matching", icon: "🧠" },
    study_creator: { name: "✍️ Study Creator", description: "Create Bible study guides", icon: "📚" },
    dimension_diver: { name: "💎 Dimension Diver", description: "Dive into 5 dimensions", icon: "🌊" },
    cycle_climber: { name: "🔄 Cycle Climber", description: "Climb through covenant cycles", icon: "🪜" },
    cross_linker: { name: "🔗 Cross Reference Linker", description: "Build cross-reference chains", icon: "🕸️" },
    apologetics_arena: { name: "🛡️ Apologetics Arena", description: "Defend the faith!", icon: "⚔️" },
    wisdom_warrior: { name: "⚡ Wisdom Warrior", description: "Apply biblical wisdom", icon: "🧙" },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const game = gameData[gameId || ""];

  if (!user) return null;

  if (!game) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-destructive">{t('games.notFound')}</h1>
            <p className="text-muted-foreground">{t('games.notFoundDescription')}</p>
            <Button onClick={() => navigate("/kids-games")} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('games.backToGames')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button onClick={() => navigate("/kids-games")} variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('games.backToGames')}
          </Button>

          <Card className="border-2 border-primary/20">
            <CardHeader className="text-center space-y-4">
              <div className="text-6xl mx-auto">{game.icon}</div>
              <CardTitle className="text-4xl">{game.name}</CardTitle>
              <CardDescription className="text-lg">{game.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-8 text-center space-y-4">
                <Construction className="h-16 w-16 mx-auto text-yellow-600 dark:text-yellow-500 animate-bounce" />
                <h3 className="text-2xl font-bold text-foreground">{t('kids.comingSoon')}</h3>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  {t('kids.comingSoonDescription')}
                </p>
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <p className="text-sm font-medium text-muted-foreground">{t('kids.moreGamesEveryWeek')}</p>
                  <Sparkles className="h-5 w-5 text-blue-500" />
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => navigate("/kids-games")} 
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  {t('kids.tryAnotherGame')}
                </Button>
                <Button 
                  onClick={() => navigate("/palace")} 
                  size="lg"
                  variant="outline"
                >
                  {t('kids.explorePalace')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default KidsGamePlay;
