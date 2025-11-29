import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Trophy, ArrowLeft, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const passages = [
  {
    reference: "Luke 15:20",
    text: "But while he was still a long way off, his father saw him and was filled with compassion for him; he ran to his son, threw his arms around him and kissed him.",
    keyObservations: [
      "Father was watching ('saw him')",
      "Son was 'still a long way off' - father had been looking",
      "Father 'ran' - culturally undignified for a patriarch",
      "'Filled with compassion' - emotion precedes son's confession",
      "'Threw his arms around him' - physical embrace before words",
      "Father initiates everything - son hasn't spoken yet"
    ]
  },
  {
    reference: "John 11:35",
    text: "Jesus wept.",
    keyObservations: [
      "Shortest verse in the Bible",
      "Jesus shows emotion - fully human",
      "He weeps even knowing resurrection is coming",
      "Present tense in Greek - ongoing weeping",
      "Shows compassion for mourners",
      "Reveals God's heart for human suffering"
    ]
  },
  {
    reference: "Genesis 3:21",
    text: "The LORD God made garments of skin for Adam and his wife and clothed them.",
    keyObservations: [
      "God Himself makes the garments",
      "'Skins' - an animal had to die",
      "First sacrifice in Scripture",
      "God covers shame, not humans",
      "Replaces inadequate fig leaves",
      "Foreshadows Christ's covering"
    ]
  },
  {
    reference: "Daniel 3:25",
    text: "He said, 'Look! I see four men walking around in the fire, unbound and unharmed, and the fourth looks like a son of the gods.'",
    keyObservations: [
      "King sees four men, not three",
      "They are 'walking around' - active, not cowering",
      "'Unbound' - ropes burned off but not their bodies",
      "'Unharmed' - miracle of protection",
      "Fourth figure described as 'like a son of the gods'",
      "Unbeliever recognizes divine presence"
    ]
  }
];

export default function ObservationGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPassage, setCurrentPassage] = useState(0);
  const [observations, setObservations] = useState("");
  const [score, setScore] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);

  const passage = passages[currentPassage];
  const progress = ((currentPassage + 1) / passages.length) * 100;

  const handleSubmit = () => {
    const userObs = observations.split('\n').filter(o => o.trim().length > 0);
    
    if (userObs.length < 3) {
      toast({
        title: "Need More Observations",
        description: "Try to find at least 3 detailed observations!",
        variant: "destructive",
      });
      return;
    }

    setScore(score + userObs.length);
    setCompleted([...completed, currentPassage]);
    setRevealed(true);
    
    toast({
      title: "Great Work!",
      description: `You found ${userObs.length} observations!`,
    });
  };

  const handleNext = () => {
    if (currentPassage < passages.length - 1) {
      setCurrentPassage(currentPassage + 1);
      setObservations("");
      setRevealed(false);
    } else {
      toast({
        title: "🎉 Observation Room Complete!",
        description: `Total observations: ${score}`,
      });
    }
  };

  const isGameComplete = currentPassage === passages.length - 1 && revealed;

  if (isGameComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="text-center">
            <CardHeader>
              <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              <CardTitle className="text-3xl">Observation Room Mastered!</CardTitle>
              <CardDescription>
                You've trained your detective eye!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary">
                {score} Total Observations
              </div>
              <p className="text-muted-foreground">
                You're seeing what others miss!
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/games")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Games
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/games")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Games
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary">Floor 2 • Observation Room (OR)</Badge>
              <Badge variant="outline">
                {currentPassage + 1} / {passages.length}
              </Badge>
            </div>
            <CardTitle className="text-3xl">🔍 Observation Detective</CardTitle>
            <CardDescription>
              Train your eye to notice details others miss. Write observations without interpretation!
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{passage.reference}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Passage Text */}
            <div className="p-6 bg-muted rounded-lg">
              <p className="text-lg leading-relaxed">{passage.text}</p>
            </div>

            {/* User Input */}
            {!revealed && (
              <>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Your Observations (one per line):
                  </h3>
                  <Textarea
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    placeholder="Example:&#10;- 'While he was still a long way off' - father had been watching&#10;- Father 'ran' - culturally undignified&#10;- 'Filled with compassion' - emotion before son's speech"
                    className="min-h-[200px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Remember: Observe details, don't interpret yet! Notice words, repetitions, order, and actions.
                  </p>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={observations.trim().length === 0}
                  className="w-full"
                  size="lg"
                >
                  Submit Observations
                </Button>
              </>
            )}

            {/* Revealed Observations */}
            {revealed && (
              <>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3 text-green-800 dark:text-green-400">
                    ✓ Key Observations to Notice:
                  </h3>
                  <ul className="space-y-2">
                    {passage.keyObservations.map((obs, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">{i + 1}</Badge>
                        <span className="text-sm">{obs}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button onClick={handleNext} className="w-full" size="lg">
                  {currentPassage < passages.length - 1 ? "Next Passage" : "Finish"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">💡 Observation Room Tip:</h4>
            <p className="text-sm text-muted-foreground">
              Like a detective at a crime scene, log EVERYTHING before theorizing. Notice: <strong>NARRATIVE</strong> (characters, numbers, objects, actions, dialogue, time, place) AND <strong>LITERARY</strong> (grammar, repetitions, contrasts, structure, what's NOT said). Count the numbers—"10 virgins, 5 wise, 5 foolish." Name the objects—"lamps, oil, vessels." List the sequence of events.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
