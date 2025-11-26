import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Sparkles, Scroll, Copy, Share2, Users, Send } from "lucide-react";
import { GameMode } from "./PTCardBattle";
import { getVerses } from "biblesdk";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [whoGoesFirst, setWhoGoesFirst] = useState<'dr_jeeves' | 'professor_jeeves'>('dr_jeeves');
  const [battleCode, setBattleCode] = useState<string | null>(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [currentBattleId, setCurrentBattleId] = useState<string | null>(null);
  const [invitingUsers, setInvitingUsers] = useState<Set<string>>(new Set());
  const [teamAName, setTeamAName] = useState("Team Alpha");
  const [teamBName, setTeamBName] = useState("Team Beta");

  useEffect(() => {
    if (mode === 'user_vs_user' || mode === 'team_vs_team') {
      loadAvailableUsers();
    }
  }, [mode]);

  const generateBattleCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const loadAvailableUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get users who were online in the last 5 minutes
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, last_seen')
        .neq('id', user.id)
        .gte('last_seen', fiveMinutesAgo)
        .order('last_seen', { ascending: false })
        .limit(10);

      setAvailableUsers(profiles || []);
    } catch (error) {
      console.error('Error loading available users:', error);
    }
  };

  const handleInviteUser = async (invitedUserId: string) => {
    if (!battleCode || !currentBattleId) return;
    
    setInvitingUsers(prev => new Set(prev).add(invitedUserId));
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      // Create notification for invited user
      await supabase
        .from('notifications')
        .insert({
          user_id: invitedUserId,
          type: 'battle_invite',
          title: 'Battle Invitation',
          message: `${profile?.display_name || 'A Phototheologist'} invites you to a Card Battle!`,
          link: `/card-deck`,
          metadata: {
            battle_code: battleCode,
            battle_id: currentBattleId,
            inviter_id: user.id,
            inviter_name: profile?.display_name || 'A Phototheologist'
          }
        });

      toast({
        title: "Invitation Sent!",
        description: "Your friend will receive a notification",
      });
    } catch (error: any) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setInvitingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitedUserId);
        return newSet;
      });
    }
  };

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
      
      // Pattern to detect Bible references (verse or chapter)
      // Matches: "Rev 13:11", "John 3:16", "Genesis 22", "Rev. 13"
      const versePattern = /^(\d?\s?[A-Za-z]+)\.?\s?(\d+):(\d+)$/;
      const chapterPattern = /^(\d?\s?[A-Za-z]+)\.?\s?(\d+)$/;
      
      const verseMatch = storyText.trim().match(versePattern);
      const chapterMatch = !verseMatch && storyText.trim().match(chapterPattern);
      
      if (verseMatch || chapterMatch) {
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
          
          if (verseMatch) {
            // Single verse reference
            const bookName = verseMatch[1].trim();
            const chapter = parseInt(verseMatch[2]);
            const verse = parseInt(verseMatch[3]);
            
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
          } else if (chapterMatch) {
            // Chapter reference - just display chapter number
            const bookName = chapterMatch[1].trim();
            const chapterNum = chapterMatch[2];
            finalStoryText = `${bookName} Chapter ${chapterNum}`;
            finalReference = storyText.trim();
            
            toast({
              title: "Chapter Reference",
              description: `Set to ${finalStoryText}`,
            });
          }
        } catch (error) {
          console.error('Error fetching verse:', error);
          // Continue with original text if fetch fails
        }
      }

      // Shuffle and deal cards
      const shuffled = shuffleArray(ALL_PRINCIPLE_CARDS);
      
      // Decide who starts based on mode
      const initialCurrentTurnPlayer = mode === 'jeeves_vs_jeeves'
        ? (whoGoesFirst === 'dr_jeeves' ? 'jeeves_1' : 'jeeves_2')
        : mode === 'team_vs_team'
        ? 'team_a'
        : `user_${user.id}`;
      
      // Generate battle code for multiplayer modes
      const newBattleCode = (mode === 'user_vs_user' || mode === 'team_vs_team') ? generateBattleCode() : null;
      
      // Create battle
      const { data: battle, error: battleError } = await supabase
        .from('pt_card_battles')
        .insert({
          game_mode: mode,
          status: (mode === 'user_vs_user' || mode === 'team_vs_team') ? 'waiting' : 'waiting',
          story_text: finalStoryText,
          story_reference: finalReference || null,
          current_turn_player: initialCurrentTurnPlayer,
          host_user_id: user.id,
          battle_code: newBattleCode,
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
      } else if (mode === 'jeeves_vs_jeeves') {
        players.push({
          battle_id: battle.id,
          player_id: 'jeeves_1',
          player_type: 'ai',
          user_id: null,
          display_name: 'Dr. Jeeves',
          cards_in_hand: shuffled.slice(0, 7),
        });
        players.push({
          battle_id: battle.id,
          player_id: 'jeeves_2',
          player_type: 'ai',
          user_id: null,
          display_name: 'Professor Jeeves',
          cards_in_hand: shuffled.slice(7, 14),
        });
      } else if (mode === 'team_vs_team') {
        // Create team A with host
        players.push({
          battle_id: battle.id,
          player_id: `user_${user.id}`,
          player_type: 'human',
          user_id: user.id,
          display_name: 'You',
          team_name: teamAName,
          cards_in_hand: shuffled.slice(0, 7),
        });
      }

      const { error: playersError } = await supabase
        .from('pt_battle_players')
        .insert(players);

      if (playersError) throw playersError;

      // For multiplayer modes, wait for opponent
      if (mode === 'user_vs_user' || mode === 'team_vs_team') {
        setBattleCode(newBattleCode!);
        setCurrentBattleId(battle.id);
        setWaitingForOpponent(true);
        
        // Subscribe to battle updates
        const channel = supabase
          .channel(`battle_${battle.id}`)
          .on('postgres_changes', {
            event: 'UPDATE',
            schema: 'public',
            table: 'pt_card_battles',
            filter: `id=eq.${battle.id}`
          }, (payload) => {
            if (payload.new.status === 'active') {
              toast({
                title: "Opponent Joined!",
                description: "The battle begins!",
              });
              channel.unsubscribe();
              onBattleStart(payload.new);
            }
          })
          .subscribe();
        
        // Reload available users for invites
        loadAvailableUsers();
        
        toast({
          title: "Battle Created!",
          description: "Share the code or invite a friend!",
        });
      } else {
        // Start battle immediately for vs Jeeves and Jeeves vs Jeeves
        const { error: updateError } = await supabase
          .from('pt_card_battles')
          .update({ status: 'active' })
          .eq('id', battle.id);

        if (updateError) throw updateError;

        toast({
          title: "Battle Created!",
          description: "Let the duel begin!",
        });

        onBattleStart({ ...battle, shouldAutoStart: mode === 'jeeves_vs_jeeves', firstPlayer: whoGoesFirst });
      }

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

  const handleJoinBattle = async () => {
    if (!joinCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter a battle code",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Find battle by code
      const { data: battle, error: battleError } = await supabase
        .from('pt_card_battles')
        .select('*')
        .eq('battle_code', joinCode.toUpperCase())
        .eq('status', 'waiting')
        .single();

      if (battleError || !battle) {
        throw new Error('Invalid or expired battle code');
      }

      // Check if already full
      const { data: existingPlayers } = await supabase
        .from('pt_battle_players')
        .select('*')
        .eq('battle_id', battle.id);

      if (existingPlayers && existingPlayers.length >= 2) {
        throw new Error('Battle is already full');
      }

      // Get remaining cards
      const usedCards: string[] = [];
      if (existingPlayers) {
        existingPlayers.forEach(p => {
          if (Array.isArray(p.cards_in_hand)) {
            usedCards.push(...p.cards_in_hand as string[]);
          }
        });
      }
      const availableCards = ALL_PRINCIPLE_CARDS.filter(c => !usedCards.includes(c));
      const shuffled = shuffleArray(availableCards);

      // Add player
      const { error: playerError } = await supabase
        .from('pt_battle_players')
        .insert({
          battle_id: battle.id,
          player_id: `user_${user.id}`,
          player_type: 'human',
          user_id: user.id,
          display_name: 'Opponent',
          cards_in_hand: shuffled.slice(0, 7),
        });

      if (playerError) throw playerError;

      // Activate battle
      const { error: updateError } = await supabase
        .from('pt_card_battles')
        .update({ status: 'active' })
        .eq('id', battle.id);

      if (updateError) throw updateError;

      toast({
        title: "Joined Battle!",
        description: "Let the duel begin!",
      });

      onBattleStart(battle);

    } catch (error: any) {
      console.error('Error joining battle:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  // Show waiting screen when waiting for opponent
  if (waitingForOpponent && battleCode) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="space-y-6"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block"
              >
                <Sparkles className="h-16 w-16 text-amber-400" />
              </motion.div>
              
              <h2 className="text-3xl font-bold">Waiting for Opponent...</h2>
              
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-8 rounded-lg border-2 border-amber-400/30">
                <p className="text-sm text-purple-200 mb-3">Share this code with your friend:</p>
                <div className="text-6xl font-bold text-amber-400 tracking-widest mb-4 font-mono">
                  {battleCode}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(battleCode);
                      toast({ title: "Copied!", description: "Battle code copied to clipboard" });
                    }}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </Button>
                  <Button
                    onClick={() => {
                      const shareText = `Join my Phototheology Card Battle! Use code: ${battleCode}`;
                      if (navigator.share) {
                        navigator.share({ title: 'Battle Invitation', text: shareText });
                      } else {
                        navigator.clipboard.writeText(shareText);
                        toast({ title: "Copied!", description: "Share message copied" });
                      }
                    }}
                    variant="outline"
                    className="border-amber-400/50 text-amber-400 hover:bg-amber-400/10"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invite Users Directly */}
        {availableUsers.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                Invite a Phototheologist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {availableUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-purple-400/50">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            {user.display_name?.[0]?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.display_name || 'Anonymous'}</p>
                          <p className="text-xs text-purple-300">
                            Active {Math.round((Date.now() - new Date(user.last_seen).getTime()) / 60000)} min ago
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleInviteUser(user.id)}
                        disabled={invitingUsers.has(user.id)}
                        size="sm"
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        {invitingUsers.has(user.id) ? (
                          'Sending...'
                        ) : (
                          <>
                            <Send className="mr-1 h-3 w-3" />
                            Invite
                          </>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
              {availableUsers.length === 0 && (
                <p className="text-center text-purple-300 py-8">No users currently online</p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button
            onClick={onBack}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel & Go Back
          </Button>
        </div>
      </motion.div>
    );
  }

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
          {/* Join Battle Option for multiplayer modes */}
          {(mode === 'user_vs_user' || mode === 'team_vs_team') && (
            <div className="space-y-4 mb-6 p-4 bg-purple-500/20 rounded-lg border-2 border-purple-400/30">
              <h3 className="font-bold text-white text-lg">Join an Existing Battle</h3>
              <div className="flex gap-2">
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Enter battle code..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 uppercase"
                  maxLength={6}
                />
                <Button
                  onClick={handleJoinBattle}
                  disabled={isJoining || !joinCode.trim()}
                  className="bg-purple-500 hover:bg-purple-600 whitespace-nowrap"
                >
                  {isJoining ? 'Joining...' : 'Join Battle'}
                </Button>
              </div>
              <p className="text-xs text-purple-200">Have a code? Enter it above to join {mode === 'team_vs_team' ? 'a team battle' : "your friend's battle"}!</p>
            </div>
          )}

          <div className="border-t border-white/20 pt-6" />

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

          {mode === 'team_vs_team' && (
            <div className="space-y-4">
              <Label className="text-white">Team Names</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Input
                    value={teamAName}
                    onChange={(e) => setTeamAName(e.target.value)}
                    placeholder="Team A name..."
                    className="bg-green-500/20 border-green-400/30 text-white placeholder:text-white/50"
                  />
                  <p className="text-xs text-green-300">Your team</p>
                </div>
                <div className="space-y-2">
                  <Input
                    value={teamBName}
                    onChange={(e) => setTeamBName(e.target.value)}
                    placeholder="Team B name..."
                    className="bg-orange-500/20 border-orange-400/30 text-white placeholder:text-white/50"
                  />
                  <p className="text-xs text-orange-300">Opposing team</p>
                </div>
              </div>
            </div>
          )}

          {mode === 'jeeves_vs_jeeves' && (
            <div className="space-y-2">
              <Label className="text-white">Who Goes First?</Label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWhoGoesFirst('dr_jeeves')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    whoGoesFirst === 'dr_jeeves'
                      ? 'bg-amber-500/30 border-amber-400 shadow-lg'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="text-white font-bold text-lg">Dr. Jeeves</div>
                  <div className="text-white/70 text-sm">First to play</div>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setWhoGoesFirst('professor_jeeves')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    whoGoesFirst === 'professor_jeeves'
                      ? 'bg-purple-500/30 border-purple-400 shadow-lg'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="text-white font-bold text-lg">Professor Jeeves</div>
                  <div className="text-white/70 text-sm">First to play</div>
                </motion.button>
              </div>
            </div>
          )}

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