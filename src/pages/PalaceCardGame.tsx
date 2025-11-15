import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trophy, RotateCcw, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface VerseCard {
  id: string;
  reference: string;
  text: string;
  isParallel: boolean;
  parallelId: string;
  isFlipped: boolean;
  isSelected: boolean;
  color: string;
}

interface ParallelPair {
  verse1: { reference: string; text: string };
  verse2: { reference: string; text: string };
  parallelExplanation: string;
  color: string;
}

// Biblical parallel pairs for the matching game
const PARALLEL_PAIRS: ParallelPair[] = [
  {
    verse1: {
      reference: "Genesis 22:2",
      text: "Take now thy son, thine only son Isaac, whom thou lovest, and get thee into the land of Moriah; and offer him there for a burnt offering upon one of the mountains which I will tell thee of."
    },
    verse2: {
      reference: "John 3:16",
      text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
    },
    parallelExplanation: "Both passages show a father offering his only beloved son as a sacrifice on a mountain. Abraham with Isaac on Mount Moriah parallels God the Father giving Jesus on Calvary.",
    color: "from-amber-600 to-yellow-700"
  },
  {
    verse1: {
      reference: "Exodus 12:13",
      text: "And the blood shall be to you for a token upon the houses where ye are: and when I see the blood, I will pass over you, and the plague shall not be upon you to destroy you, when I smite the land of Egypt."
    },
    verse2: {
      reference: "1 Corinthians 5:7",
      text: "Purge out therefore the old leaven, that ye may be a new lump, as ye are unleavened. For even Christ our passover is sacrificed for us."
    },
    parallelExplanation: "The Passover lamb's blood protected Israel from death in Egypt. Christ is our Passover lamb whose blood saves us from spiritual death—both are unblemished sacrifices at appointed times that bring deliverance.",
    color: "from-red-600 to-rose-700"
  },
  {
    verse1: {
      reference: "Jonah 1:17",
      text: "Now the LORD had prepared a great fish to swallow up Jonah. And Jonah was in the belly of the fish three days and three nights."
    },
    verse2: {
      reference: "Matthew 12:40",
      text: "For as Jonas was three days and three nights in the whale's belly; so shall the Son of man be three days and three nights in the heart of the earth."
    },
    parallelExplanation: "Jesus himself declares this parallel: Jonah's three days in the fish foreshadows Christ's three days in the tomb. Both emerge alive as a sign to their generation.",
    color: "from-blue-600 to-cyan-700"
  },
  {
    verse1: {
      reference: "Numbers 21:8-9",
      text: "And the LORD said unto Moses, Make thee a fiery serpent, and set it upon a pole: and it shall come to pass, that every one that is bitten, when he looketh upon it, shall live. And Moses made a serpent of brass, and put it upon a pole."
    },
    verse2: {
      reference: "John 3:14-15",
      text: "And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up: That whosoever believeth in him should not perish, but have eternal life."
    },
    parallelExplanation: "The bronze serpent lifted up brought healing from deadly snake bites. Jesus connects this directly to His crucifixion—lifted up on the cross, He brings healing from the serpent's (Satan's) deadly bite of sin.",
    color: "from-bronze-600 to-copper-700"
  },
  {
    verse1: {
      reference: "Genesis 2:21-22",
      text: "And the LORD God caused a deep sleep to fall upon Adam, and he slept: and he took one of his ribs, and closed up the flesh instead thereof; And the rib, which the LORD God had taken from man, made he a woman, and brought her unto the man."
    },
    verse2: {
      reference: "Ephesians 5:25-27",
      text: "Husbands, love your wives, even as Christ also loved the church, and gave himself for it; That he might sanctify and cleanse it with the washing of water by the word, That he might present it to himself a glorious church."
    },
    parallelExplanation: "Eve was formed from Adam's wounded side while he slept in a death-like state. The church, Christ's bride, was born from His pierced side while He 'slept' in death on the cross.",
    color: "from-pink-600 to-rose-700"
  },
  {
    verse1: {
      reference: "Exodus 17:6",
      text: "Behold, I will stand before thee there upon the rock in Horeb; and thou shalt smite the rock, and there shall come water out of it, that the people may drink. And Moses did so in the sight of the elders of Israel."
    },
    verse2: {
      reference: "1 Corinthians 10:4",
      text: "And did all drink the same spiritual drink: for they drank of that spiritual Rock that followed them: and that Rock was Christ."
    },
    parallelExplanation: "Paul explicitly states the rock Moses struck was Christ. The rock struck once provided life-giving water; Christ struck once on the cross provides living water of eternal life.",
    color: "from-stone-600 to-gray-700"
  },
  {
    verse1: {
      reference: "Genesis 45:4-5",
      text: "And Joseph said unto his brethren, Come near to me, I pray you. And they came near. And he said, I am Joseph your brother, whom ye sold into Egypt. Now therefore be not grieved, nor angry with yourselves, that ye sold me hither: for God did send me before you to preserve life."
    },
    verse2: {
      reference: "Acts 7:9-10",
      text: "And the patriarchs, moved with envy, sold Joseph into Egypt: but God was with him, And delivered him out of all his afflictions, and gave him favour and wisdom in the sight of Pharaoh king of Egypt; and he made him governor over Egypt and all his house."
    },
    parallelExplanation: "Joseph rejected by his brothers, sold for silver, exalted to save many parallels Jesus rejected by His people, betrayed for silver, exalted to God's right hand to save the world. Both say 'you meant evil, but God meant it for good.'",
    color: "from-gold-600 to-yellow-700"
  },
  {
    verse1: {
      reference: "2 Kings 2:11",
      text: "And it came to pass, as they still went on, and talked, that, behold, there appeared a chariot of fire, and horses of fire, and parted them both asunder; and Elijah went up by a whirlwind into heaven."
    },
    verse2: {
      reference: "Acts 1:9",
      text: "And when he had spoken these things, while they beheld, he was taken up; and a cloud received him out of their sight."
    },
    parallelExplanation: "Both Elijah and Jesus ascended into heaven in the presence of their disciples. The dramatic ascensions marked the transfer of ministry and the promise of return—Elisha received Elijah's mantle; the church received the Holy Spirit.",
    color: "from-sky-600 to-blue-700"
  },
  {
    verse1: {
      reference: "Leviticus 16:21-22",
      text: "And Aaron shall lay both his hands upon the head of the live goat, and confess over him all the iniquities of the children of Israel, and all their transgressions in all their sins, putting them upon the head of the goat, and shall send him away by the hand of a fit man into the wilderness: And the goat shall bear upon him all their iniquities unto a land not inhabited."
    },
    verse2: {
      reference: "Isaiah 53:6",
      text: "All we like sheep have gone astray; we have turned every one to his own way; and the LORD hath laid on him the iniquity of us all."
    },
    parallelExplanation: "The scapegoat ceremonially carried Israel's sins into the wilderness. Isaiah prophesies this finds fulfillment in Christ who literally bore our iniquities, carrying our sins away from us 'as far as the east is from the west.'",
    color: "from-gray-600 to-stone-700"
  },
  {
    verse1: {
      reference: "1 Samuel 17:49",
      text: "And David put his hand in his bag, and took thence a stone, and slang it, and smote the Philistine in his forehead, that the stone sunk into his forehead; and he fell upon his face to the earth."
    },
    verse2: {
      reference: "Colossians 2:15",
      text: "And having spoiled principalities and powers, he made a shew of them openly, triumphing over them in it."
    },
    parallelExplanation: "David, the unlikely shepherd, defeated the giant enemy of God's people with a stone to the head. Jesus, the humble servant, crushed the serpent's head and defeated Satan, the giant enemy of souls, through the cross.",
    color: "from-indigo-600 to-blue-700"
  }
];

// Distractor verses that don't parallel anything in the current round
const DISTRACTOR_VERSES = [
  { reference: "Psalm 23:1", text: "The LORD is my shepherd; I shall not want." },
  { reference: "Proverbs 3:5-6", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths." },
  { reference: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },
  { reference: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
  { reference: "Romans 8:28", text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
  { reference: "Philippians 4:13", text: "I can do all things through Christ which strengtheneth me." },
  { reference: "Hebrews 11:1", text: "Now faith is the substance of things hoped for, the evidence of things not seen." },
  { reference: "James 1:2-3", text: "My brethren, count it all joy when ye fall into divers temptations; Knowing this, that the trying of your faith worketh patience." },
  { reference: "1 John 4:8", text: "He that loveth not knoweth not God; for God is love." },
  { reference: "Psalm 119:105", text: "Thy word is a lamp unto my feet, and a light unto my path." },
  { reference: "Matthew 6:33", text: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you." },
  { reference: "2 Timothy 3:16", text: "All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness." },
  { reference: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble." },
  { reference: "Isaiah 26:3", text: "Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee." },
  { reference: "Romans 12:2", text: "And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God." }
];

export default function PalaceCardGame() {
  const navigate = useNavigate();
  const [cards, setCards] = useState<VerseCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [currentParallelPair, setCurrentParallelPair] = useState<ParallelPair | null>(null);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    initializeRound();
  }, []);

  const initializeRound = () => {
    // Select a random parallel pair
    const parallelPair = PARALLEL_PAIRS[Math.floor(Math.random() * PARALLEL_PAIRS.length)];
    setCurrentParallelPair(parallelPair);

    // Select 6 random distractor verses
    const shuffledDistractors = [...DISTRACTOR_VERSES].sort(() => Math.random() - 0.5);
    const selectedDistractors = shuffledDistractors.slice(0, 6);

    // Create 8 cards: 2 parallel + 6 distractors
    const parallelId = `parallel-${Date.now()}`;
    const gameCards: VerseCard[] = [
      {
        id: `card-1-${Date.now()}`,
        reference: parallelPair.verse1.reference,
        text: parallelPair.verse1.text,
        isParallel: true,
        parallelId,
        isFlipped: false,
        isSelected: false,
        color: 'from-slate-700 to-slate-800'
      },
      {
        id: `card-2-${Date.now()}`,
        reference: parallelPair.verse2.reference,
        text: parallelPair.verse2.text,
        isParallel: true,
        parallelId,
        isFlipped: false,
        isSelected: false,
        color: 'from-slate-700 to-slate-800'
      },
      ...selectedDistractors.map((verse, idx) => ({
        id: `card-distractor-${idx}-${Date.now()}`,
        reference: verse.reference,
        text: verse.text,
        isParallel: false,
        parallelId: '',
        isFlipped: false,
        isSelected: false,
        color: 'from-slate-700 to-slate-800'
      }))
    ];

    // Shuffle all cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setSelectedCards([]);
    setShowExplanation(false);
  };

  const handleCardClick = (cardId: string) => {
    if (showExplanation) return;

    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    // Flip the card
    setCards(cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: !c.isFlipped } : c
    ));
  };

  const handleCardSelect = (cardId: string) => {
    if (showExplanation) return;

    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    // Toggle selection
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
      setCards(cards.map(c => 
        c.id === cardId ? { ...c, isSelected: false } : c
      ));
    } else if (selectedCards.length < 2) {
      const newSelected = [...selectedCards, cardId];
      setSelectedCards(newSelected);
      setCards(cards.map(c => 
        c.id === cardId ? { ...c, isSelected: true } : c
      ));

      // Check if 2 cards are selected
      if (newSelected.length === 2) {
        checkMatch(newSelected);
      }
    }
  };

  const checkMatch = (selected: string[]) => {
    const card1 = cards.find(c => c.id === selected[0]);
    const card2 = cards.find(c => c.id === selected[1]);

    if (!card1 || !card2) return;

    // Check if both are parallel cards
    if (card1.isParallel && card2.isParallel && card1.parallelId === card2.parallelId) {
      // Correct match!
      toast.success("Excellent! You found the parallel verses!");
      setShowExplanation(true);
    } else {
      // Wrong match
      toast.error("These verses don't parallel each other. Keep looking!");
      setTimeout(() => {
        setSelectedCards([]);
        setCards(cards.map(c => ({ ...c, isSelected: false })));
      }, 1500);
    }
  };

  const handleNextRound = () => {
    const newRoundsCompleted = roundsCompleted + 1;
    setRoundsCompleted(newRoundsCompleted);

    if (newRoundsCompleted >= 5) {
      setGameWon(true);
    } else {
      initializeRound();
    }
  };

  const resetGame = () => {
    setRoundsCompleted(0);
    setGameWon(false);
    initializeRound();
  };

  if (gameWon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-12 text-center bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-2 border-amber-500/50">
          <Trophy className="w-24 h-24 mx-auto mb-6 text-amber-400" />
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Victory!
          </h1>
          <p className="text-xl text-slate-300 mb-4">
            You've completed {roundsCompleted} rounds of parallel matching!
          </p>
          <p className="text-slate-400 mb-8">
            You successfully identified biblical parallels across Scripture, discovering how events echo through God's redemptive plan.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame} className="gradient-palace text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={() => navigate("/games")} variant="outline">
              Back to Games
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/games")}
              className="gap-2 text-white/80 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                PARALLELS MATCH
              </h1>
              <p className="text-sm text-amber-200/80">
                Find the 2 Verses That Parallel Each Other
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetGame}
              className="gap-2 border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </Button>
          </div>
        </div>
      </div>

      {/* Game Stats */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">Round</p>
            <p className="text-3xl font-bold text-amber-400">{roundsCompleted + 1} / 5</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">Selected</p>
            <p className="text-3xl font-bold text-blue-400">{selectedCards.length} / 2</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="max-w-3xl mx-auto mb-8 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
          <p className="text-center text-slate-300">
            Click cards to flip and read the verses. Select the 2 cards that contain parallel passages.
          </p>
        </div>

        {/* Explanation Panel */}
        {showExplanation && currentParallelPair && (
          <Card className="max-w-4xl mx-auto mb-8 p-6 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-2 border-green-500/50">
            <div className="flex items-start gap-4 mb-4">
              <CheckCircle className="w-8 h-8 text-green-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-green-300 mb-2">Parallel Discovered!</h3>
                <p className="text-slate-300 leading-relaxed">{currentParallelPair.parallelExplanation}</p>
              </div>
            </div>
            <div className="flex justify-center mt-6">
              <Button onClick={handleNextRound} className="gradient-palace text-white">
                Continue to Next Round
              </Button>
            </div>
          </Card>
        )}

        {/* Card Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {cards.map((card) => (
            <div
              key={card.id}
              className="aspect-[3/4] cursor-pointer"
              style={{ perspective: "1000px" }}
            >
              <div
                className={`relative w-full h-full transition-all duration-500 ${
                  card.isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front - Reference */}
                <div
                  onClick={() => handleCardClick(card.id)}
                  className={`absolute w-full h-full rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border-4 ${
                    card.isSelected ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]' : 'border-slate-600'
                  } shadow-xl flex flex-col items-center justify-center p-4 hover:border-amber-500/50 transition-colors`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <p className="text-xl font-bold text-white text-center mb-2">
                    {card.reference}
                  </p>
                  <p className="text-xs text-white/60">Click to read verse</p>
                </div>

                {/* Back - Verse Text */}
                <div
                  className={`absolute w-full h-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border-4 ${
                    card.isSelected ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.5)]' : 'border-slate-600'
                  } shadow-xl p-4 overflow-y-auto [transform:rotateY(180deg)]`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <p className="text-xs font-bold text-amber-400 mb-3">{card.reference}</p>
                  <p className="text-sm text-slate-200 leading-relaxed mb-4">{card.text}</p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardSelect(card.id);
                    }}
                    size="sm"
                    variant={card.isSelected ? "default" : "outline"}
                    className={`w-full ${card.isSelected ? 'bg-amber-500 hover:bg-amber-600' : 'border-amber-500/50 text-amber-300 hover:bg-amber-500/20'}`}
                  >
                    {card.isSelected ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Selected
                      </>
                    ) : (
                      'Select This Verse'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
