import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, Trophy, RotateCcw, Send, CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EventCard {
  id: string;
  questionEvent: {
    title: string;
    story: string;
    reference: string;
  };
  correctAnswer: {
    title: string;
    story: string;
    reference: string;
  };
  distractorAnswers: Array<{
    title: string;
    story: string;
    reference: string;
  }>;
  parallelKey: string;
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
  selectedAnswer: number | null;
  color: string;
}

interface MatchedPair {
  card1: {
    eventTitle: string;
    eventStory: string;
    eventReference: string;
  };
  card2: {
    eventTitle: string;
    eventStory: string;
    eventReference: string;
  };
  parallelKey: string;
  userAnswer: string;
  isValidated: boolean;
  isValidating: boolean;
  color: string;
}

const PARALLEL_PAIRS = [
  // CREATION PATTERNS
  {
    event1Title: "Third Day of Creation",
    event1Story: "On the third day, God said 'Let the earth bring forth grass, the herb yielding seed, and the fruit tree.' The earth brought forth vegetation, and it was good. Life emerged from the ground.",
    event1Reference: "Genesis 1:11-13",
    event2Title: "Jesus' Third Day Resurrection",
    event2Story: "Jesus rose from the dead on the third day. Paul writes, 'But now Christ is risen from the dead, and has become the firstfruits of those who have fallen asleep.' He is the firstfruits from the ground.",
    event2Reference: "1 Cor 15:20; Matt 28:1-6",
    parallelKey: "Third day brings life from the earth; firstfruits emerge from the ground; both mark new creation and life from death",
    color: "from-green-600 via-emerald-700 to-green-800"
  },
  {
    event1Title: "Light Created First Day",
    event1Story: "God said, 'Let there be light,' and there was light. God divided the light from the darkness, calling the light Day and the darkness Night.",
    event1Reference: "Genesis 1:3-5",
    event2Title: "Christ the Light of the World",
    event2Story: "Jesus declared, 'I am the light of the world. He who follows Me shall not walk in darkness, but have the light of life.' John writes, 'The light shines in the darkness, and the darkness did not comprehend it.'",
    event2Reference: "John 8:12; 1:5",
    parallelKey: "First creation: light precedes all life; In Christ: light precedes new creation; both separate light from darkness",
    color: "from-yellow-600 via-amber-700 to-yellow-800"
  },
  {
    event1Title: "God Rests Seventh Day",
    event1Story: "On the seventh day God ended His work which He had done, and He rested. God blessed the seventh day and sanctified it, because in it He rested from all His work.",
    event1Reference: "Genesis 2:2-3",
    event2Title: "Christ's Rest and Ours",
    event2Story: "Jesus said, 'Come to Me, all you who labor and are heavy laden, and I will give you rest.' Hebrews says, 'There remains therefore a rest for the people of God. For he who has entered His rest has himself also ceased from his works.'",
    event2Reference: "Matthew 11:28; Hebrews 4:9-10",
    parallelKey: "God's rest after completing creation work; Christ offers rest after completing redemption work; both are entrance into completed work",
    color: "from-blue-600 via-indigo-700 to-blue-800"
  },
  {
    event1Title: "Passover Lamb",
    event1Story: "In Egypt, each household took a lamb without blemish, killed it at twilight, and put its blood on the doorposts. The destroyer passed over those houses, sparing the firstborn inside.",
    event1Reference: "Exodus 12:3-13",
    event2Title: "Christ Our Passover",
    event2Story: "John the Baptist declared Jesus 'the Lamb of God who takes away the sin of the world.' Paul wrote, 'Christ our Passover is sacrificed for us.'",
    event2Reference: "John 1:29; 1 Cor 5:7",
    parallelKey: "An unblemished lamb's blood provides protection from death; sacrifice at appointed time brings deliverance",
    color: "from-red-600 via-rose-700 to-red-800"
  },
  {
    event1Title: "Joseph Saves from Famine",
    event1Story: "Joseph, betrayed by his brothers and sold for silver, was raised to Pharaoh's right hand. He saved Egypt and his family from famine, saying, 'You meant evil, but God meant it for good to save many people alive.'",
    event1Reference: "Genesis 45:5-8; 50:20",
    event2Title: "Jesus Saves from Sin",
    event2Story: "Jesus, betrayed for thirty pieces of silver, was raised to God's right hand. He saves the world from spiritual death. What was meant for evil, God used for salvation of the world.",
    event2Reference: "Acts 2:23-24; 5:31",
    parallelKey: "Rejected by brothers, exalted by Gentiles; sold for silver; suffering leads to salvation; right hand of power; saves many from death",
    color: "from-yellow-600 via-gold-700 to-yellow-800"
  },
  {
    event1Title: "Moses Delivers from Egypt",
    event1Story: "Moses, after forty years in Midian, returned to Egypt. Through signs and wonders, he led Israel out of bondage through the Red Sea into freedom.",
    event1Reference: "Exodus 3:10; 14:30",
    event2Title: "Jesus Delivers from Sin",
    event2Story: "Jesus, after forty days in the wilderness, began His ministry with signs and wonders. He leads us from slavery to sin through death and resurrection into freedom.",
    event2Reference: "Luke 4:14-21; Rom 6:6-7",
    parallelKey: "Forty period of testing; delivers from bondage through water; signs and wonders authenticate; freedom from slavery",
    color: "from-blue-600 via-cyan-700 to-blue-800"
  },
  {
    event1Title: "David Defeats Goliath",
    event1Story: "Young David, armed only with a sling and stones, defeated the giant Goliath who defied the armies of Israel. He struck him in the forehead and cut off his head with the giant's own sword.",
    event1Reference: "1 Samuel 17:41-51",
    event2Title: "Jesus Defeats Satan",
    event2Story: "Jesus, though tempted in the wilderness, defeated Satan with the Word of God. Through His death and resurrection, He crushed the serpent's head and triumphed over principalities and powers.",
    event2Reference: "Matthew 4:1-11; Col 2:15",
    parallelKey: "Unlikely champion defeats seemingly invincible enemy; victory secures deliverance for God's people; enemy's weapon turned against him",
    color: "from-indigo-600 via-blue-700 to-indigo-800"
  },
  {
    event1Title: "Isaac on Mount Moriah",
    event1Story: "Abraham took his only son Isaac to Mount Moriah to offer him as a sacrifice. Isaac carried the wood for the burnt offering up the mountain.",
    event1Reference: "Genesis 22:1-10",
    event2Title: "Jesus on Calvary",
    event2Story: "God gave His only begotten Son. Jesus carried His cross to Golgotha, where He was offered as a sacrifice for the sins of the world.",
    event2Reference: "John 3:16; 19:17",
    parallelKey: "A father offering his only beloved son on a mountain; the son carries the instrument of sacrifice; substitutionary provision",
    color: "from-amber-600 via-yellow-700 to-amber-800"
  }
];

export default function PalaceCardGame() {
  const navigate = useNavigate();
  const [eventCards, setEventCards] = useState<EventCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<EventCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<MatchedPair[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const totalPairs = 6;

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...PARALLEL_PAIRS].sort(() => Math.random() - 0.5);
    const selectedPairs = shuffled.slice(0, totalPairs);
    const allPairs = [...PARALLEL_PAIRS];
    
    // Create a mapping of themes to avoid similar parallels as distractors
    const themeKeywords = (parallelKey: string) => {
      const lower = parallelKey.toLowerCase();
      const themes: string[] = [];
      if (lower.includes('defeat') || lower.includes('victory') || lower.includes('enemy')) themes.push('victory');
      if (lower.includes('sacrifice') || lower.includes('offering') || lower.includes('death')) themes.push('sacrifice');
      if (lower.includes('deliver') || lower.includes('freedom') || lower.includes('bondage') || lower.includes('slavery')) themes.push('deliverance');
      if (lower.includes('creation') || lower.includes('life') || lower.includes('firstfruits')) themes.push('creation');
      if (lower.includes('rest') || lower.includes('completed')) themes.push('rest');
      if (lower.includes('light') || lower.includes('darkness')) themes.push('light');
      if (lower.includes('save') || lower.includes('salvation')) themes.push('salvation');
      return themes;
    };
    
    const cards: EventCard[] = selectedPairs.map((pair, index) => {
      const pairThemes = themeKeywords(pair.parallelKey);
      
      // Get distractors from pairs with DIFFERENT themes to avoid plausible parallels
      const otherPairs = allPairs.filter(p => {
        if (p === pair) return false;
        const otherThemes = themeKeywords(p.parallelKey);
        // Avoid pairs that share ANY themes
        return !pairThemes.some(theme => otherThemes.includes(theme));
      });
      
      const shuffledOthers = otherPairs.sort(() => Math.random() - 0.5);
      const distractors = shuffledOthers.slice(0, 3).map(p => ({
        title: p.event2Title,
        story: p.event2Story,
        reference: p.event2Reference,
      }));

      return {
        id: `card-${index}`,
        questionEvent: {
          title: pair.event1Title,
          story: pair.event1Story,
          reference: pair.event1Reference,
        },
        correctAnswer: {
          title: pair.event2Title,
          story: pair.event2Story,
          reference: pair.event2Reference,
        },
        distractorAnswers: distractors,
        parallelKey: pair.parallelKey,
        pairId: `pair-${index}`,
        isFlipped: false,
        isMatched: false,
        selectedAnswer: null,
        color: pair.color,
      };
    });
    
    setEventCards(cards);
    setSelectedCards([]);
    setMatchedPairs([]);
    setGameWon(false);
  };

  const handleCardClick = (cardId: string) => {
    const card = eventCards.find(c => c.id === cardId);
    if (!card || card.isMatched || card.isFlipped) return;

    setEventCards(prev =>
      prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c)
    );
  };

  const handleAnswerSelect = (cardId: string, answerIndex: number) => {
    const card = eventCards.find(c => c.id === cardId);
    if (!card) return;

    setEventCards(prev =>
      prev.map(c => c.id === cardId ? { ...c, selectedAnswer: answerIndex } : c)
    );

    // Check if correct (index 0 is always correct after shuffle)
    const allAnswers = [card.correctAnswer, ...card.distractorAnswers];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
    const correctIndex = shuffledAnswers.findIndex(a => a.title === card.correctAnswer.title);

    if (answerIndex === correctIndex) {
      toast.success("Correct! Now explain the parallel connection.");
      
      setMatchedPairs(prev => [...prev, {
        card1: { 
          eventTitle: card.questionEvent.title,
          eventStory: card.questionEvent.story,
          eventReference: card.questionEvent.reference,
        },
        card2: {
          eventTitle: card.correctAnswer.title,
          eventStory: card.correctAnswer.story,
          eventReference: card.correctAnswer.reference,
        },
        parallelKey: card.parallelKey,
        userAnswer: "",
        isValidated: false,
        isValidating: false,
        color: card.color,
      }]);

      setEventCards(prev =>
        prev.map(c => c.id === cardId ? { ...c, isMatched: true } : c)
      );
    } else {
      toast.error("Not the right parallel. Try again!");
      setTimeout(() => {
        setEventCards(prev =>
          prev.map(c => c.id === cardId ? { ...c, isFlipped: false, selectedAnswer: null } : c)
        );
      }, 1500);
    }
  };

  const handleAnswerChange = (pairIndex: number, answer: string) => {
    setMatchedPairs(prev =>
      prev.map((pair, idx) =>
        idx === pairIndex ? { ...pair, userAnswer: answer } : pair
      )
    );
  };

  const handleSubmitAnswer = async (pairIndex: number) => {
    const pair = matchedPairs[pairIndex];
    if (!pair.userAnswer.trim()) {
      toast.error("Please explain the connection first");
      return;
    }

    setMatchedPairs(prev =>
      prev.map((p, idx) =>
        idx === pairIndex ? { ...p, isValidating: true } : p
      )
    );

    try {
      const { data, error } = await supabase.functions.invoke('validate-principle-application', {
        body: {
          principle: `Parallel: ${pair.card1.eventTitle} ↔ ${pair.card2.eventTitle}. Key connection: ${pair.parallelKey}`,
          application: pair.userAnswer,
          correctAnswer: pair.parallelKey,
          validateConcept: true, // Focus on conceptual understanding, not verse citations
        },
      });

      if (error) throw error;

      if (data.isValid) {
        setMatchedPairs(prev =>
          prev.map((p, idx) =>
            idx === pairIndex ? { ...p, isValidated: true, isValidating: false } : p
          )
        );
        toast.success("Perfect! You understood the parallel!");
        
        const validatedCount = matchedPairs.filter((p, idx) => 
          p.isValidated || idx === pairIndex
        ).length;
        
        if (validatedCount === totalPairs) {
          setGameWon(true);
          toast.success("🎉 You've mastered all parallels!");
        }
      } else {
        toast.error(data.feedback || "Think deeper about the connection.");
        setMatchedPairs(prev =>
          prev.map((p, idx) =>
            idx === pairIndex ? { ...p, isValidating: false } : p
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to validate");
      setMatchedPairs(prev =>
        prev.map((p, idx) =>
          idx === pairIndex ? { ...p, isValidating: false } : p
        )
      );
    }
  };

  const unmatched = eventCards.filter(c => !c.isMatched);
  const validatedCount = matchedPairs.filter(p => p.isValidated).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Matched</p>
              <p className="text-2xl font-bold gradient-palace bg-clip-text text-transparent">
                {matchedPairs.length} / {totalPairs}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Explained</p>
              <p className="text-2xl font-bold text-green-600">
                {validatedCount} / {totalPairs}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={initializeGame} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              New Game
            </Button>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Biblical Parallels Match
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Stage 1: Find cards that parallel each other. Stage 2: Explain the connection.
          </p>
        </div>

        {gameWon && (
          <div className="text-center mb-8 p-8 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-lg border-2 border-yellow-500/50">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-3xl font-bold mb-2">Master of Parallels!</h2>
            <p className="text-xl text-muted-foreground mb-6">
              You discovered and explained all {totalPairs} parallels!
            </p>
            <Button onClick={initializeGame} size="lg" className="gradient-palace text-white">
              <RotateCcw className="mr-2 h-5 w-5" />
              New Challenge
            </Button>
          </div>
        )}

        {unmatched.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              Find the Matching Parallels ({unmatched.length} cards)
            </h2>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mb-12">
              {unmatched.map((card) => {
                const allAnswers = [card.correctAnswer, ...card.distractorAnswers];
                const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
                
                return (
                  <Card
                    key={card.id}
                    className={`overflow-hidden transition-all duration-300 bg-slate-800/50 backdrop-blur border-slate-700 ${
                      card.isFlipped ? 'ring-2 ring-blue-500' : 'cursor-pointer hover:scale-105 hover:shadow-2xl'
                    }`}
                    onClick={() => !card.isFlipped && handleCardClick(card.id)}
                  >
                    {!card.isFlipped ? (
                      <CardContent className="p-8 h-96 flex items-center justify-center">
                        <div className={`text-center p-6 rounded-xl bg-gradient-to-br ${card.color} w-full`}>
                          <div className="text-6xl mb-3">📜</div>
                          <p className="text-base text-white font-semibold">Click to reveal</p>
                        </div>
                      </CardContent>
                    ) : (
                      <CardContent className="p-6 h-96 overflow-y-auto">
                        <h3 className="font-bold text-lg mb-3 text-white">{card.questionEvent.title}</h3>
                        <p className="text-sm text-slate-300 mb-3 leading-relaxed">{card.questionEvent.story}</p>
                        <p className="text-xs italic text-blue-400 font-medium mb-4">{card.questionEvent.reference}</p>
                        
                        <div className="border-t border-slate-600 pt-4 mt-4">
                          <p className="text-sm font-semibold text-white mb-3">Select the parallel event:</p>
                          <div className="space-y-2">
                            {shuffledAnswers.map((answer, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAnswerSelect(card.id, idx);
                                }}
                                disabled={card.selectedAnswer !== null}
                                className={`w-full text-left p-3 rounded-lg transition-all text-sm ${
                                  card.selectedAnswer === idx
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700/50 text-slate-200 hover:bg-slate-700'
                                } disabled:cursor-not-allowed`}
                              >
                                <span className="font-semibold">{String.fromCharCode(65 + idx)}.</span> {answer.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {matchedPairs.length > 0 && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-white">
              Explain the Connections
            </h2>
            <div className="grid gap-6 md:grid-cols-1 max-w-4xl mx-auto">
              {matchedPairs.map((pair, index) => (
                <Card
                  key={`pair-${index}`}
                  className={`overflow-hidden bg-slate-800/70 backdrop-blur border-slate-700 ${pair.isValidated ? 'ring-2 ring-green-500' : ''}`}
                >
                  <div className={`h-3 bg-gradient-to-r ${pair.color}`} />
                  <CardContent className="p-8 space-y-5">
                    <div className="bg-slate-900/60 rounded-lg p-5 border-l-4 border-blue-500">
                      <h3 className="font-bold text-lg mb-2 text-white">{pair.card1.eventTitle}</h3>
                      <p className="text-sm text-slate-300">{pair.card1.eventReference}</p>
                    </div>

                    <div className="text-center text-3xl text-slate-400">⇅</div>

                    <div className="bg-slate-900/60 rounded-lg p-5 border-l-4 border-blue-500">
                      <h3 className="font-bold text-lg mb-2 text-white">{pair.card2.eventTitle}</h3>
                      <p className="text-sm text-slate-300">{pair.card2.eventReference}</p>
                    </div>

                    {!pair.isValidated && (
                      <>
                        <div className="space-y-3">
                          <label className="text-base font-medium text-white">
                            Explain how these events parallel (no verse required):
                          </label>
                          <Textarea
                            value={pair.userAnswer}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            placeholder="Focus on the connections and patterns between these events..."
                            className="min-h-[120px] bg-slate-900/80 border-slate-600 text-white placeholder:text-slate-400"
                          />
                        </div>
                        <Button
                          onClick={() => handleSubmitAnswer(index)}
                          disabled={!pair.userAnswer.trim() || pair.isValidating}
                          className="w-full"
                        >
                          {pair.isValidating ? (
                            <>Validating...</>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Submit
                            </>
                          )}
                        </Button>
                      </>
                    )}

                    {pair.isValidated && (
                      <div className="flex items-center justify-center gap-2 text-green-600 font-medium py-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Validated!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
