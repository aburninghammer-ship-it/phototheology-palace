import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Trophy, Flame, Sparkles, Save, HelpCircle } from "lucide-react";
import palaceImage from "@/assets/palace-card-back.jpg";

interface Props {
  battle: any;
  currentUserId: string;
  onBack: () => void;
}

interface Player {
  player_id: string;
  display_name: string;
  cards_in_hand: string[];
  cards_played: string[];
  score: number;
}

// Principle descriptions map
const PRINCIPLE_INFO: Record<string, { name: string; description: string }> = {
  // Floor 1 - Furnishing
  "SR": { name: "Story Room", description: "Store Bible stories as vivid mental movies - each story becomes a memorable scene." },
  "IR": { name: "Imagination Room", description: "Step inside stories with sanctified imagination - feel, see, and experience Scripture emotionally." },
  "24": { name: "24FPS Room", description: "Break Scripture into frames - one symbolic image for each chapter, like a mental film strip." },
  "BR": { name: "Bible Rendered Room", description: "Map the entire Bible with master images per 24-chapter block - scan all Scripture in minutes." },
  "TR": { name: "Translation Room", description: "Convert abstract texts into concrete images - turn words into vivid mental pictures." },
  "GR": { name: "Gems Room", description: "Collect striking insights and powerful discoveries - build your treasury of spiritual weapons." },
  
  // Floor 2 - Investigation
  "OR": { name: "Observation Room", description: "Notice details without interpretation - log fingerprints and footprints like a detective." },
  "DC": { name: "Def-Com Room", description: "Test words under microscope - Greek/Hebrew definitions and historical/cultural commentary." },
  "ST": { name: "Symbols/Types Room", description: "Recognize God's universal language - Lamb=Christ, Rock=Christ, Light=truth, Water=Spirit." },
  "QR": { name: "Questions Room", description: "Ask relentless questions until truth emerges - interrogate the text thoroughly." },
  "QA": { name: "Q&A Room", description: "Cross-examine witnesses - let Scripture answer Scripture to confirm truth." },
  
  // Floor 3 - Freestyle
  "NF": { name: "Nature Freestyle", description: "See lessons in creation - every flower, bird, and storm becomes a reminder of God's truth." },
  "PF": { name: "Personal Freestyle", description: "Turn your life into object lessons - every joy, mistake, and delay points back to Scripture." },
  "BF": { name: "Bible Freestyle", description: "Connect verses spontaneously - every verse is related, trace genealogies of thought on the fly." },
  "HF": { name: "History Freestyle", description: "Let the Bible interpret the world - see current events and history through Scripture's lens." },
  "LR": { name: "Listening Room", description: "Turn conversations into connections - listen carefully and instantly link remarks to Scripture." },
  
  // Floor 4 - Next Level
  "CR": { name: "Concentration Room", description: "Every text must reveal Christ. No matter how ordinary a verse looks, it must point to Jesus." },
  "DR": { name: "Dimensions Room", description: "View texts through 5 dimensions: Literal, Christ, Me (personal), Church (corporate), and Heaven (eternal)." },
  "C6": { name: "Connect 6 Room", description: "Connect texts across 6 genres: Prophecy, Parable, Epistle, History, Gospel, and Poetry." },
  "TRm": { name: "Theme Room", description: "Anchor verses on the great walls: Sanctuary, Life of Christ, Great Controversy, Time-Prophecy, Gospel, Heaven." },
  "TZ": { name: "Time Zone Room", description: "Locate texts across 6 time zones: Heaven-Past, Heaven-Present, Heaven-Future, Earth-Past, Earth-Present, Earth-Future." },
  "PRm": { name: "Patterns Room", description: "Recognize recurring motifs - 40 days, 3 days, deliverer stories repeating with variation." },
  "P‖": { name: "Parallels Room", description: "See mirrored actions across time - Babel/Pentecost, Exodus/Return, reflecting history." },
  "FRt": { name: "Fruit Room", description: "Test if study produces Christlike character - love, joy, peace, patience, and all fruits of the Spirit." },
  
  // Time Zone sub-cards
  "HP": { name: "Heaven-Past", description: "View text through Heaven-Past: before earth's creation, Lucifer's rebellion, the origin of the great controversy." },
  "HN": { name: "Heaven-Present", description: "View text through Heaven-Present: Christ's intercession, sanctuary ministry, the mediatorial work happening now." },
  "HFu": { name: "Heaven-Future", description: "View text through Heaven-Future: new heaven, eternal throne, ultimate restoration with God." },
  "EPa": { name: "Earth-Past", description: "View text through Earth-Past: historical biblical events already fulfilled in redemptive history." },
  "EP": { name: "Earth-Present", description: "View text through Earth-Present: current application to believers today, how we live now." },
  "EF": { name: "Earth-Future", description: "View text through Earth-Future: end-time events, Second Coming, final prophecies yet to be fulfilled." },
  
  // Dimensions sub-cards
  "DR-1D": { name: "1D (Literal-Historical)", description: "What actually happened in the original context? What did it mean to the original audience?" },
  "DR-2D": { name: "2D (Christological)", description: "How does this text reveal, foreshadow, or fulfill Christ? Where is Jesus in this passage?" },
  "DR-3D": { name: "3D (Personal)", description: "What does this mean for YOUR walk with God today? How should you personally respond?" },
  "DR-4D": { name: "4D (Ecclesiological)", description: "What does this teach the church corporately? How does it shape our worship, mission, or unity?" },
  "DR-5D": { name: "5D (Eschatological)", description: "How will this be perfected in the new creation? What does it reveal about our eternal hope?" },
  
  // Connect 6 sub-cards
  "C6-Pr": { name: "Prophecy", description: "Connect this text to a prophecy passage and explain how they illuminate each other." },
  "C6-Pa": { name: "Parable", description: "Connect this text to a parable and explain how they illuminate each other." },
  "C6-Ep": { name: "Epistle", description: "Connect this text to an epistle passage and explain how they illuminate each other." },
  "C6-Hi": { name: "History", description: "Connect this text to a historical narrative and explain how they illuminate each other." },
  "C6-Go": { name: "Gospel", description: "Connect this text to a gospel passage and explain how they illuminate each other." },
  "C6-Po": { name: "Poetry", description: "Connect this text to a poetry/psalm passage and explain how they illuminate each other." },
  
  // Theme sub-cards
  "TRm-Sanc": { name: "Sanctuary Wall", description: "How does this passage relate to God's dwelling, sacrifice, priesthood, or mediation?" },
  "TRm-Life": { name: "Life of Christ Wall", description: "How does this passage relate to Jesus' birth, ministry, death, resurrection, or ascension?" },
  "TRm-GC": { name: "Great Controversy Wall", description: "How does this passage expose the cosmic battle between Christ and Satan, truth and error?" },
  "TRm-Time": { name: "Time-Prophecy Wall", description: "How does this passage provide prophetic chronology or apocalyptic vision?" },
  "TRm-Gosp": { name: "Gospel Floor", description: "How does this passage articulate the foundation of salvation by grace through faith?" },
  "TRm-Heav": { name: "Heaven Ceiling", description: "How does this passage describe the ultimate eschatological hope and final restoration?" },
  
  // Fruit sub-cards
  "FRt-Love": { name: "Love", description: "How does this text demonstrate or cultivate agape love—selfless, sacrificial, unconditional?" },
  "FRt-Joy": { name: "Joy", description: "How does this text produce or reveal joy—deep gladness rooted in God's presence?" },
  "FRt-Peace": { name: "Peace", description: "How does this text bring shalom—wholeness, rest, reconciliation with God and others?" },
  "FRt-Patience": { name: "Patience", description: "How does this text cultivate longsuffering—endurance under trial, slowness to anger?" },
  "FRt-Kindness": { name: "Kindness", description: "How does this text demonstrate gentleness—tender compassion and gracious goodwill?" },
  "FRt-Goodness": { name: "Goodness", description: "How does this text reveal moral excellence and benevolent action toward others?" },
  "FRt-Faithfulness": { name: "Faithfulness", description: "How does this text show reliability, trustworthiness, and steadfast loyalty to God?" },
  "FRt-Gentleness": { name: "Gentleness", description: "How does this text display meekness—strength under control, humility, teachability?" },
  "FRt-SelfControl": { name: "Self-Control", description: "How does this text teach temperance—mastery over desires, discipline, restraint?" },
  
  // Floor 5 - Vision
  "PR": { name: "Prophecy Room", description: "Align prophetic timelines like stars in constellations - Daniel, Revelation, and repeat-and-enlarge patterns." },
  "BL": { name: "Blue Room (Sanctuary)", description: "The sanctuary is the blueprint of salvation - every piece of furniture points to Christ's work." },
  "3A": { name: "Three Angels' Room", description: "The final gospel message from Revelation 14 - everlasting gospel, Babylon fallen, mark warning." },
  
  // Blue Room sub-cards
  "BL-Gate": { name: "Gate/Door", description: "Christ as the Gate/Door to God's presence (John 10:9) - the only way to enter the Father's courts." },
  "BL-Altar": { name: "Bronze Altar", description: "Sacrifice, atonement, and Christ's blood at the altar - where sin meets substitution." },
  "BL-Laver": { name: "Laver", description: "Cleansing, washing, and sanctification (Eph 5:26) - the Word washing us daily." },
  "BL-Lamp": { name: "Lampstand", description: "Light, testimony, and the Spirit's work (Rev 1:20) - Christ as the light of the world." },
  "BL-Table": { name: "Table of Showbread", description: "Christ as the Bread of Life and provision (John 6:35) - sustained by His presence." },
  "BL-Incense": { name: "Altar of Incense", description: "Prayer, intercession, and Christ's mediation (Rev 8:3-4) - our prayers mingled with His merit." },
  "BL-Veil": { name: "Veil", description: "The torn veil and access to God (Heb 10:19-20) - Christ's flesh opening the way to the Father." },
  "BL-Ark": { name: "Ark of the Covenant", description: "God's throne, law, and mercy seat (Rom 3:25) - where justice and mercy meet." },
  
  // Feast Room sub-cards
  "FR-Pass": { name: "Passover", description: "Christ as our Passover Lamb (1 Cor 5:7) - deliverance through His blood." },
  "FR-Unlv": { name: "Unleavened Bread", description: "Removing sin/leaven and living in purity - putting away the old life." },
  "FR-First": { name: "Firstfruits", description: "Christ's resurrection as the firstfruits (1 Cor 15:20) - guarantee of our resurrection." },
  "FR-Pent": { name: "Pentecost", description: "The outpouring of the Holy Spirit (Acts 2) - power for witness and mission." },
  "FR-Trum": { name: "Trumpets", description: "The call to awakening and gathering - preparing for the day of judgment." },
  "FR-Aton": { name: "Day of Atonement", description: "Judgment, cleansing, and final atonement (Lev 16) - the investigative judgment." },
  "FR-Tab": { name: "Tabernacles", description: "God dwelling with us and future restoration - the final harvest and eternal dwelling." },
  
  // Math Room sub-cards
  "MR-70W": { name: "70 Weeks", description: "The 70 weeks prophecy (Daniel 9) - Messiah's timeline and Jerusalem's restoration." },
  "MR-1260": { name: "1260 Years", description: "The 1260 year prophecy - papal supremacy and the time of tribulation." },
  "MR-2300": { name: "2300 Days", description: "The 2300 day prophecy (Daniel 8:14) - sanctuary cleansing and investigative judgment." },
  "MR-120": { name: "120 Years (Noah)", description: "Noah's 120 year prophecy - God's patience and the final warning period." },
  "MR-400": { name: "400 Years", description: "The 400 years of captivity prophecy (Genesis 15:13) - Israel's bondage in Egypt." },
  "MR-70Y": { name: "70 Years", description: "The 70 years of Babylonian exile (Jeremiah 25:11) - consequence and restoration." },
  
  // Three Angels sub-cards
  "3A-1st": { name: "First Angel", description: "Fear God, give glory, hour of judgment, worship Creator - the everlasting gospel to all." },
  "3A-2nd": { name: "Second Angel", description: "Babylon is fallen - exposing false systems and calling God's people out." },
  "3A-3rd": { name: "Third Angel", description: "Warning against beast, mark, image - the patience of the saints who keep God's commandments." },
  
  // Floor 6 - Cycles & Heavens
  "@Ad": { name: "Adamic Cycle", description: "Creation, fall, promise - the seed promise in Genesis 3:15 and the beginning of redemption." },
  "@No": { name: "Noahic Cycle", description: "Flood, preservation, covenant - God's faithfulness to preserve a remnant through judgment." },
  "@Ab": { name: "Abrahamic Cycle", description: "Faith, promise, seed - all nations blessed through Abraham's offspring, Christ." },
  "@Mo": { name: "Mosaic Cycle", description: "Law, tabernacle, priesthood - the covenant at Sinai and God dwelling among His people." },
  "@Cy": { name: "Cyrusic Cycle", description: "Exile, restoration, temple rebuilt - return from Babylon and renewed worship." },
  "@CyC": { name: "Cyrus-Christ Cycle", description: "Type to antitype - Cyrus the deliverer pointing to Christ the true Deliverer." },
  "@Sp": { name: "Spirit Cycle", description: "Pentecost, church age, mission - the Spirit empowering global witness." },
  "@Re": { name: "Remnant Cycle", description: "Final conflict, judgment, new creation - the last generation and Christ's return." },
  "1H": { name: "First Heaven", description: "Babylon/Restoration - the first Day of the Lord and post-exilic renewal (586 BC - return)." },
  "2H": { name: "Second Heaven", description: "70 AD/New Covenant - the second Day of the Lord and heavenly sanctuary order (church age)." },
  "3H": { name: "Third Heaven", description: "Final Judgment/New Creation - the third Day of the Lord and literal new heavens and earth." },
  "JR": { name: "Juice Room", description: "Squeeze one book with all Phototheology principles - extract every drop of meaning." },
  
  // Floor 7 - Spiritual & Emotional
  "FRm": { name: "Fire Room", description: "Let truth burn, convict, and transform - feel the emotional weight of Scripture in your soul." },
  "MR": { name: "Meditation Room", description: "Slow down and marinate in truth - breathe the words until they saturate your spirit." },
  "SRm": { name: "Speed Room", description: "Rapid application and quick recall - train reflexes for instant connections in ministry." },
  "CEC": { name: "Christ in Every Chapter", description: "Name and trace the line to Christ in every chapter - explicit, anchored confession." },
  "R66": { name: "Room 66", description: "Trace one theme through all 66 books - theology that walks Genesis to Revelation." },
};

export function BattleArena({ battle, currentUserId, onBack }: Props) {
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gameStatus, setGameStatus] = useState(battle.status);
  const [winner, setWinner] = useState(battle.winner);
  const [moves, setMoves] = useState<any[]>([]);
  const [expandedMoves, setExpandedMoves] = useState<Set<string>>(new Set());
  const [lastJudgment, setLastJudgment] = useState<any>(null);
  const [showRejectionOptions, setShowRejectionOptions] = useState(false);
  const [isChallenging, setIsChallenging] = useState(false);

  useEffect(() => {
    loadPlayers();
    loadMoves();
    
    // Subscribe to battle updates
    const channel = supabase
      .channel(`battle:${battle.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pt_battle_players',
        filter: `battle_id=eq.${battle.id}`
      }, () => {
        loadPlayers();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pt_battle_moves',
        filter: `battle_id=eq.${battle.id}`
      }, () => {
        loadMoves();
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pt_card_battles',
        filter: `id=eq.${battle.id}`
      }, (payload) => {
        setGameStatus(payload.new.status);
        setWinner(payload.new.winner);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [battle.id]);

  const loadPlayers = async () => {
    const { data } = await supabase
      .from('pt_battle_players')
      .select('*')
      .eq('battle_id', battle.id);
    
    if (data) {
      setPlayers(data.map(p => ({
        player_id: p.player_id,
        display_name: p.display_name,
        cards_in_hand: Array.isArray(p.cards_in_hand) ? p.cards_in_hand.filter((c): c is string => typeof c === 'string') : [],
        cards_played: Array.isArray(p.cards_played) ? p.cards_played.filter((c): c is string => typeof c === 'string') : [],
        score: p.score,
      })));
    }
  };

  const loadMoves = async () => {
    const { data } = await supabase
      .from('pt_battle_moves')
      .select('*')
      .eq('battle_id', battle.id)
      .order('move_number', { ascending: false })
      .limit(5);
    
    if (data) {
      setMoves(data);
    }
  };

  const handlePlayCard = async () => {
    if (!selectedCard || !response.trim()) {
      toast({
        title: "Incomplete Move",
        description: "Select a card and write your response",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('judge-card-battle', {
        body: {
          battleId: battle.id,
          playerId: `user_${currentUserId}`,
          cardCode: selectedCard,
          responseText: response,
          storyText: battle.story_text,
        },
      });

      if (error) throw error;

      const judgment = data.judgment;
      setLastJudgment(judgment);
      
      if (judgment.verdict === 'rejected') {
        setShowRejectionOptions(true);
        toast({
          title: '❌ Rejected by Jeeves',
          description: "You can challenge Jeeves' judgment or pick another card.",
          variant: 'destructive',
        });
      } else {
        toast({
          title: '✅ Approved!',
          description: judgment.feedback,
        });
        setSelectedCard(null);
        setResponse("");
        setShowRejectionOptions(false);
        await loadPlayers();
        await loadMoves();

        // If playing against Jeeves, he plays next after approval
        if (battle.mode === 'vs_jeeves') {
          setTimeout(() => handleJeevesPlay(), 2000);
        }
      }

    } catch (error: any) {
      console.error('Error playing card:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChallenge = async () => {
    if (!lastJudgment) return;

    setIsChallenging(true);
    try {
      const { data, error } = await supabase.functions.invoke('challenge-judgment', {
        body: {
          battleId: battle.id,
          playerId: `user_${currentUserId}`,
          originalJudgment: lastJudgment,
          cardCode: selectedCard,
          responseText: response,
          storyText: battle.story_text,
        },
      });

      if (error) throw error;

      const finalVerdict = data.finalVerdict;
      
      if (finalVerdict === 'challenge_upheld') {
        toast({
          title: '✅ Challenge Successful!',
          description: 'Jeeves has reconsidered - your move is now approved!',
        });
        setSelectedCard(null);
        setResponse("");
        setShowRejectionOptions(false);
        await loadPlayers();
        await loadMoves();

        // Jeeves plays next after successful challenge
        if (battle.mode === 'vs_jeeves') {
          setTimeout(() => handleJeevesPlay(), 2000);
        }
      } else {
        toast({
          title: '❌ Challenge Denied',
          description: data.explanation || 'Jeeves stands by his original judgment.',
          variant: 'destructive',
        });
        // Keep rejection options visible
      }
    } catch (error: any) {
      console.error('Error challenging:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsChallenging(false);
    }
  };

  const handlePickAnotherCard = () => {
    setSelectedCard(null);
    setResponse("");
    setShowRejectionOptions(false);
    setLastJudgment(null);
    toast({
      title: "Pick Another Card",
      description: "Select a different principle card to try again.",
    });
  };

  const handleJeevesPlay = async () => {
    const jeevesPlayer = players.find(p => p.player_id === 'jeeves_1');
    if (!jeevesPlayer || jeevesPlayer.cards_in_hand.length === 0) return;

    setIsSubmitting(true);
    try {
      // Pick a random card from Jeeves' hand
      const randomCard = jeevesPlayer.cards_in_hand[
        Math.floor(Math.random() * jeevesPlayer.cards_in_hand.length)
      ];

      // Generate a response from Jeeves
      const jeevesResponses = [
        `Through ${randomCard}, we see this story illuminates the sanctuary pattern where...`,
        `Applying ${randomCard} reveals how this narrative parallels the covenant structure of...`,
        `Using ${randomCard}, we discover Christ as the central figure who fulfills...`,
        `The principle ${randomCard} helps us understand this text in the cycle of redemption where...`,
        `When viewed through ${randomCard}, this passage connects to the broader prophetic timeline...`
      ];
      
      const randomResponse = jeevesResponses[Math.floor(Math.random() * jeevesResponses.length)];

      const { data, error } = await supabase.functions.invoke('judge-card-battle', {
        body: {
          battleId: battle.id,
          playerId: 'jeeves_1',
          cardCode: randomCard,
          responseText: randomResponse,
          storyText: battle.story_text,
        },
      });

      if (error) throw error;

      await loadPlayers();
      await loadMoves();

      if (data.judgment.verdict === 'approved') {
        toast({
          title: "Jeeves Played",
          description: `${randomCard}: ${data.judgment.feedback}`,
        });
      }
    } catch (error: any) {
      console.error('Error with Jeeves play:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentPlayer = players.find(p => p.player_id === `user_${currentUserId}`);
  const opponent = players.find(p => p.player_id !== `user_${currentUserId}`);

  if (gameStatus === 'completed') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white p-12">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Trophy className="h-32 w-32 text-amber-400 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(251,191,36,0.7)]" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-4">
            {winner === `user_${currentUserId}` ? '🎉 Victory!' : '😊 Good Fight!'}
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            {players.find(p => p.player_id === winner)?.display_name} wins the battle!
          </p>
          <Button onClick={onBack} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Modes
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button and Story */}
      <div className="flex justify-between items-start">
        <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Card className="flex-1 mx-4 bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-orange-400" />
              <h3 className="font-bold">The Story</h3>
              {battle.story_reference && (
                <Badge variant="outline" className="text-xs">{battle.story_reference}</Badge>
              )}
            </div>
            <p className="text-sm text-purple-100">{battle.story_text}</p>
          </CardContent>
        </Card>
      </div>

      {/* Players */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Opponent */}
        {opponent && (
          <Card className="bg-red-500/20 backdrop-blur-xl border-red-400/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{opponent.display_name}</h3>
                <Badge className="bg-red-500 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  {opponent.score}
                </Badge>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: opponent.cards_in_hand.length }).map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-16 rounded bg-gradient-to-br from-red-600 to-pink-600 border-2 border-red-400/50"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Player */}
        {currentPlayer && (
          <Card className="bg-blue-500/20 backdrop-blur-xl border-blue-400/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{currentPlayer.display_name}</h3>
                <Badge className="bg-blue-500 text-white">
                  <Trophy className="h-3 w-3 mr-1" />
                  {currentPlayer.score}
                </Badge>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {currentPlayer.cards_in_hand.map((card) => (
                  <div key={card} className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1, y: -10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCard(card)}
                      className={`
                        relative cursor-pointer rounded-lg p-2 text-center text-xs font-bold
                        bg-gradient-to-br from-purple-600 to-pink-600 border-2
                        ${selectedCard === card ? 'border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)]' : 'border-purple-400/50'}
                      `}
                    >
                      <img src={palaceImage} alt="card" className="w-full h-12 object-cover rounded mb-1 opacity-30" />
                      <span className="text-white drop-shadow-lg">{card}</span>
                    </motion.div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button 
                          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-600 border border-white/30 flex items-center justify-center text-white/80 hover:bg-purple-500 hover:text-white transition-colors z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <HelpCircle className="w-3 h-3" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400/30">
                        <div className="space-y-2">
                          <h4 className="font-bold text-amber-300">{PRINCIPLE_INFO[card]?.name || card}</h4>
                          <p className="text-sm text-white/90">{PRINCIPLE_INFO[card]?.description || "Phototheology principle"}</p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Move History */}
      {moves.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Recent Moves
            </h3>
            <div className="space-y-3">
              {moves.map((move) => {
                const player = players.find(p => p.player_id === move.player_id);
                const isExpanded = expandedMoves.has(move.id);
                const isJeeves = move.player_id === 'jeeves_1';
                
                return (
                  <motion.div
                    key={move.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      move.judge_verdict === 'approved'
                        ? 'bg-green-500/10 border-green-400/30 hover:bg-green-500/20'
                        : 'bg-red-500/10 border-red-400/30 hover:bg-red-500/20'
                    } ${isJeeves ? 'border-l-4 border-l-amber-400' : ''}`}
                    onClick={() => {
                      const newExpanded = new Set(expandedMoves);
                      if (isExpanded) {
                        newExpanded.delete(move.id);
                      } else {
                        newExpanded.add(move.id);
                      }
                      setExpandedMoves(newExpanded);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white flex items-center gap-1">
                          {player?.display_name || 'Unknown'}
                          {isJeeves && <span className="text-amber-400">🤖</span>}
                        </span>
                        <div className="flex items-center gap-1">
                          <Badge className="bg-purple-500 text-white font-bold">{move.card_used}</Badge>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button 
                                className="text-white/60 hover:text-purple-400 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <HelpCircle className="w-4 h-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 bg-gradient-to-br from-purple-900 to-pink-900 border-purple-400/30">
                              <div className="space-y-2">
                                <h4 className="font-bold text-amber-300">{PRINCIPLE_INFO[move.card_used]?.name || move.card_used}</h4>
                                <p className="text-sm text-white/90">{PRINCIPLE_INFO[move.card_used]?.description || "Phototheology principle"}</p>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Badge className={move.judge_verdict === 'approved' ? 'bg-green-500' : 'bg-red-500'}>
                          {move.judge_verdict === 'approved' ? '✓' : '✗'} {move.points_awarded}pts
                        </Badge>
                      </div>
                      <span className="text-xs text-white/60">Move #{move.move_number}</span>
                    </div>
                    
                    <div className="mb-3">
                      <p className={`text-sm font-semibold text-white/90 mb-1 ${isJeeves ? 'text-amber-200' : ''}`}>
                        {isJeeves ? '🎯 Jeeves\' Response:' : '📝 Your Response:'}
                      </p>
                      <p className="text-sm text-white/80 whitespace-pre-wrap">
                        {isExpanded ? move.response_text : `${move.response_text.substring(0, 150)}...`}
                      </p>
                      {!isExpanded && move.response_text.length > 150 && (
                        <button className="text-xs text-amber-400 hover:text-amber-300 mt-1">
                          Click to see full response
                        </button>
                      )}
                    </div>
                    
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-xs font-semibold text-purple-300 mb-1">⚖️ Jeeves' Judgment:</p>
                      <p className="text-sm text-purple-200 italic">"{move.judge_feedback}"</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response Area */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardContent className="pt-6 space-y-4">
          {/* Show rejection options if card was rejected */}
          {showRejectionOptions && lastJudgment && (
            <div className="p-4 bg-red-500/20 border-2 border-red-400/50 rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-2xl">❌</span>
                <div className="flex-1">
                  <h4 className="font-bold text-red-200 mb-1">Jeeves Rejected Your Move</h4>
                  <p className="text-sm text-red-100 italic mb-3">"{lastJudgment.feedback}"</p>
                  <p className="text-sm text-white/80 mb-3">
                    You can challenge Jeeves' judgment or pick a different card to try again.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleChallenge}
                  disabled={isChallenging}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  {isChallenging ? 'Challenging...' : '⚔️ Challenge Jeeves'}
                </Button>
                <Button
                  onClick={handlePickAnotherCard}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  🔄 Pick Another Card
                </Button>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Your Response {selectedCard && <Badge className="ml-2 bg-amber-500">{selectedCard}</Badge>}
            </label>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="How does your selected principle card amplify this story? Show depth, insight, and biblical grounding..."
              className="min-h-32 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={!selectedCard || showRejectionOptions}
            />
          </div>
          
          {!showRejectionOptions && (
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handlePlayCard}
                  disabled={!selectedCard || !response.trim() || isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold py-6 text-lg shadow-lg"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit to Jeeves
                    </>
                  )}
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleJeevesPlay}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold py-6 text-lg shadow-lg"
                >
                  {isSubmitting ? (
                    'Jeeves is playing...'
                  ) : (
                    <>
                      🤖 Jeeves Play Your Turn
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}