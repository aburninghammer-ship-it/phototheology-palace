import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Scroll } from "lucide-react";
import { GameMode } from "./PTCardBattle";
import { getVerses } from "biblesdk";

interface Props {
  mode: GameMode;
  onBattleStart: (battle: any) => void;
  onBack: () => void;
}

// All available PT principle cards
const ALL_PRINCIPLE_CARDS = [
  "@Ad", "@No", "@Ab", "@Mo", "@Cy", "@CyC", "@Sp", "@Re",
  "1H", "2H", "3H",
  "DR-1D", "DR-2D", "DR-3D", "DR-4D", "DR-5D",
  "C6-Pr", "C6-Pa", "C6-Ep", "C6-Hi", "C6-Go", "C6-Po",
  "TZ-HP", "TZ-HN", "TZ-HF", "TZ-EP", "TZ-EN", "TZ-EF",
  "BL-Gate", "BL-Altar", "BL-Laver", "BL-Lamp", "BL-Table", "BL-Incense", "BL-Veil", "BL-Ark",
  "FR-Pass", "FR-Unlv", "FR-First", "FR-Pent", "FR-Trum", "FR-Aton", "FR-Tab",
  "FRt-Love", "FRt-Joy", "FRt-Peace", "FRt-Patience", "FRt-Kindness", "FRt-Goodness",
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function BattleLobby({ mode, onBattleStart, onBack }: Props) {
  const { toast } = useToast();
  const [storyText, setStoryText] = useState("");
  const [storyReference, setStoryReference] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBattle = async () => {
    if (!storyText.trim()) {
      toast({
        title: "Story Required",
        description: "Please enter a Bible story or text",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if input is just a reference and fetch the full verse text
      let finalStoryText = storyText;
      let finalReference = storyReference;
      
      // Pattern to detect simple Bible references (e.g., "Rev 13:11", "John 3:16")
      const simpleRefPattern = /^(\d?\s?[A-Za-z]+\.?\s?\d+:\d+)$/;
      if (simpleRefPattern.test(storyText.trim())) {
        try {
          // Map common book names to BibleSDK codes
          const bookMap: Record<string, string> = {
            'Gen': 'GEN', 'Genesis': 'GEN', 'Ex': 'EXO', 'Exodus': 'EXO',
            'Lev': 'LEV', 'Leviticus': 'LEV', 'Num': 'NUM', 'Numbers': 'NUM',
            'Deut': 'DEU', 'Deuteronomy': 'DEU', 'Josh': 'JOS', 'Joshua': 'JOS',
            'Judg': 'JDG', 'Judges': 'JDG', 'Ruth': 'RUT', '1 Sam': '1SA',
            '2 Sam': '2SA', '1 Kings': '1KI', '2 Kings': '2KI', '1 Chr': '1CH',
            '2 Chr': '2CH', 'Ezra': 'EZR', 'Neh': 'NEH', 'Esth': 'EST',
            'Job': 'JOB', 'Ps': 'PSA', 'Psalm': 'PSA', 'Psalms': 'PSA',
            'Prov': 'PRO', 'Proverbs': 'PRO', 'Eccl': 'ECC', 'Ecclesiastes': 'ECC',
            'Song': 'SNG', 'Is': 'ISA', 'Isaiah': 'ISA', 'Jer': 'JER',
            'Jeremiah': 'JER', 'Lam': 'LAM', 'Ezek': 'EZK', 'Ezekiel': 'EZK',
            'Dan': 'DAN', 'Daniel': 'DAN', 'Hos': 'HOS', 'Joel': 'JOL',
            'Amos': 'AMO', 'Obad': 'OBA', 'Jonah': 'JON', 'Mic': 'MIC',
            'Nah': 'NAM', 'Hab': 'HAB', 'Zeph': 'ZEP', 'Hag': 'HAG',
            'Zech': 'ZEC', 'Mal': 'MAL',
            'Matt': 'MAT', 'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK',
            'John': 'JHN', 'Acts': 'ACT', 'Rom': 'ROM', 'Romans': 'ROM',
            '1 Cor': '1CO', '2 Cor': '2CO', 'Gal': 'GAL', 'Galatians': 'GAL',
            'Eph': 'EPH', 'Ephesians': 'EPH', 'Phil': 'PHP', 'Philippians': 'PHP',
            'Col': 'COL', 'Colossians': 'COL', '1 Thess': '1TH', '2 Thess': '2TH',
            '1 Tim': '1TI', '2 Tim': '2TI', 'Titus': 'TIT', 'Philem': 'PHM',
            'Heb': 'HEB', 'Hebrews': 'HEB', 'James': 'JAS', '1 Pet': '1PE',
            '2 Pet': '2PE', '1 John': '1JN', '2 John': '2JN', '3 John': '3JN',
            'Jude': 'JUD', 'Rev': 'REV', 'Revelation': 'REV'
          };
          
          // Parse the reference
          const match = storyText.trim().match(/^(\d?\s?[A-Za-z]+)\.?\s?(\d+):(\d+)$/);
          if (match) {
            const bookName = match[1].trim();
            const chapter = parseInt(match[2]);
            const verse = parseInt(match[3]);
            
            const bookCode = bookMap[bookName] || bookMap[bookName.replace('.', '')];
            if (bookCode) {
              const response: any = await getVerses(bookCode, chapter, [verse, verse]);
              if (response && response.phrases && response.phrases.length > 0) {
                finalStoryText = response.phrases.map((p: any) => p.text).join(' ');
                finalReference = storyText.trim();
                
                toast({
                  title: "Verse Loaded",
                  description: `Fetched full text for ${storyText.trim()}`,
                });
              }
            }
          }
        } catch (error) {
          console.error('Error fetching verse:', error);
          // Continue with original text if fetch fails
        }
      }

      // Shuffle and deal cards
      const shuffled = shuffleArray(ALL_PRINCIPLE_CARDS);
      
      // Create battle
      const { data: battle, error: battleError } = await supabase
        .from('pt_card_battles')
        .insert({
          game_mode: mode,
          status: 'waiting',
          story_text: finalStoryText,
          story_reference: finalReference || null,
          current_turn_player: `user_${user.id}`,
          host_user_id: user.id,
        })
        .select()
        .single();

      if (battleError) throw battleError;

      // Create players based on mode
      const players: any[] = [];
      
      if (mode === 'user_vs_jeeves') {
        players.push({
          battle_id: battle.id,
          player_id: `user_${user.id}`,
          player_type: 'human',
          user_id: user.id,
          display_name: 'You',
          cards_in_hand: shuffled.slice(0, 7),
        });
        players.push({
          battle_id: battle.id,
          player_id: 'jeeves_1',
          player_type: 'ai',
          user_id: null,
          display_name: 'Jeeves',
          cards_in_hand: shuffled.slice(7, 14),
        });
      }
      // Add other mode logic as needed

      const { error: playersError } = await supabase
        .from('pt_battle_players')
        .insert(players);

      if (playersError) throw playersError;

      // Start battle immediately for vs Jeeves
      const { error: updateError } = await supabase
        .from('pt_card_battles')
        .update({ status: 'active' })
        .eq('id', battle.id);

      if (updateError) throw updateError;

      toast({
        title: "Battle Created!",
        description: "Let the duel begin!",
      });

      onBattleStart(battle);

    } catch (error: any) {
      console.error('Error creating battle:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Scroll className="h-6 w-6 text-amber-400" />
              Setup Your Battle
            </CardTitle>
            <div className="w-20" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-white">Bible Story or Text</Label>
            <Textarea
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="Enter a Bible reference (e.g., Rev. 13:11) or paste a full story/passage..."
              className="min-h-32 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <p className="text-xs text-purple-200">
              💡 Tip: Enter just a verse reference (like "John 3:16") and the full text will be automatically loaded!
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Reference (Optional)</Label>
            <Input
              value={storyReference}
              onChange={(e) => setStoryReference(e.target.value)}
              placeholder="e.g., Genesis 22:1-19 (auto-filled if you enter a reference above)"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleCreateBattle}
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-6 text-lg shadow-lg shadow-amber-500/50"
            >
              {isCreating ? (
                <>Creating Battle...</>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Battle
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}