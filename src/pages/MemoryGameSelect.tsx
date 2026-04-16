import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Puzzle, Type, Shuffle } from "lucide-react";

export default function MemoryGameSelect() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const games = [
    {
      id: "word-order",
      title: t('memory.game.select.wordOrderTitle'),
      description: t('memory.game.select.wordOrderDesc'),
      icon: Shuffle,
      difficulty: t('memory.game.select.difficultyMedium'),
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      id: "fill-blank",
      title: t('memory.game.select.fillBlankTitle'),
      description: t('memory.game.select.fillBlankDesc'),
      icon: Type,
      difficulty: t('memory.game.select.difficultyEasy'),
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      id: "first-letter",
      title: t('memory.game.select.firstLetterTitle'),
      description: t('memory.game.select.firstLetterDesc'),
      icon: Puzzle,
      difficulty: t('memory.game.select.difficultyHard'),
      color: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/memory")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('memory.game.backToMemory')}
        </Button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('memory.game.select.title')}</h1>
            <p className="text-muted-foreground">
              {t('memory.game.select.subtitle')}
            </p>
          </div>

          <div className="grid gap-4">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/memory/game/${game.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${game.color}`}>
                      <game.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted">
                      {game.difficulty}
                    </span>
                  </div>
                  <CardTitle className="mt-4">{game.title}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">
                    {t('memory.game.select.playGame')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}