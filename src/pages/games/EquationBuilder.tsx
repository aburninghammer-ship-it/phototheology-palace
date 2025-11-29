import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calculator, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TextShareButton } from "@/components/TextShareButton";

const EQUATION_PIECES = [
  "1D", "2D", "3D", "4D", "5D",
  "|S", "|LC", "|GC", "|TP",
  "ALTAR", "LAVER", "TABLE", "LAMP", "INCENSE", "ARK",
  "+", "→", "∥", "≅", "⊙", "⚖",
  "Ep", "Ef", "Hpa", "Hp", "Hf"
];

const DOCTRINE_PROMPTS = [
  "What is repentance?",
  "Why does the Sabbath matter?",
  "Explain justification by faith",
  "What is the state of the dead?",
  "Define sanctification",
  "Why is the cross central?",
  "What is the remnant?",
  "Explain the investigative judgment",
];

export default function EquationBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availablePieces, setAvailablePieces] = useState<string[]>([]);
  const [selectedPieces, setSelectedPieces] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [explanation, setExplanation] = useState("");
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sharingToCommunity, setSharingToCommunity] = useState(false);

  useEffect(() => {
    startRound();
  }, []);

  const startRound = () => {
    const shuffled = [...EQUATION_PIECES].sort(() => Math.random() - 0.5);
    setAvailablePieces(shuffled.slice(0, 12));
    setSelectedPieces([]);
    const prompt = DOCTRINE_PROMPTS[Math.floor(Math.random() * DOCTRINE_PROMPTS.length)];
    setCurrentPrompt(prompt);
    setExplanation("");
  };

  const addPiece = (piece: string) => {
    if (selectedPieces.length < 5) {
      setSelectedPieces([...selectedPieces, piece]);
    }
  };

  const removePiece = (index: number) => {
    setSelectedPieces(selectedPieces.filter((_, i) => i !== index));
  };

  const shareEquationToCommunity = async () => {
    if (!user) {
      toast.error("Please sign in to share");
      return;
    }

    if (selectedPieces.length < 3) {
      toast.error("Build an equation with at least 3 pieces first");
      return;
    }

    if (!explanation.trim()) {
      toast.error("Add an explanation before sharing");
      return;
    }

    setSharingToCommunity(true);
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, username')
        .eq('id', user.id)
        .single();

      const displayName = profile?.display_name || profile?.username || 'A student';
      const equationString = selectedPieces.join(' ');
      const postTitle = `Help ${displayName} solve this Phototheology equation!`;
      const postContent = `**Challenge:** ${currentPrompt}

**Equation:**
\`\`\`
${equationString}
\`\`\`

**Explanation:**
${explanation}

Can you improve this equation or offer insights? Share your thoughts!`;

      const { data: newPost, error: postError } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: postTitle,
          content: postContent,
          category: 'challenge'
        })
        .select()
        .single();

      if (postError) throw postError;

      // Get users who want equation challenge notifications (excluding the poster)
      const { data: interestedUsers } = await supabase
        .from('notification_preferences')
        .select('user_id')
        .eq('equation_challenges', true)
        .neq('user_id', user.id);

      // Create notifications for interested users
      if (interestedUsers && interestedUsers.length > 0) {
        const notifications = interestedUsers.map(u => ({
          user_id: u.user_id,
          type: 'equation_challenge',
          title: 'New Equation Challenge!',
          message: `${displayName} shared a new equation builder challenge`,
          link: `/community`,
          metadata: {
            post_id: newPost?.id,
            equation: equationString,
            prompt: currentPrompt
          }
        }));

        await supabase.from('notifications').insert(notifications);
      }

      // Broadcast to all live users
      const liveChannel = supabase.channel('live-notifications');
      await liveChannel.send({
        type: 'broadcast',
        event: 'challenge-shared',
        payload: {
          type: 'challenge-shared',
          message: '🔔 New Challenge Alert!',
          challengeType: 'Equation Builder Challenge',
          userName: displayName,
          link: '/community'
        }
      });

      toast.success("Equation shared to community! All online users notified.");
    } catch (error) {
      console.error("Error sharing to community:", error);
      toast.error("Failed to share to community");
    } finally {
      setSharingToCommunity(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedPieces.length < 3) {
      toast.error("Build an equation with at least 3 pieces");
      return;
    }
    if (!explanation.trim()) {
      toast.error("Explain what your equation means");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          mode: "validate_equation",
          prompt: currentPrompt,
          equation: selectedPieces,
          explanation,
        }
      });

      if (error) throw error;

      const { clarity, feedback, points } = data;

      if (clarity === "excellent") {
        setScore(prev => prev + 3);
        toast.success(`Gospel clarity! +3 points. ${feedback}`);
      } else if (clarity === "good") {
        setScore(prev => prev + 2);
        toast.success(`Good equation! +2 points. ${feedback}`);
      } else {
        setScore(prev => prev + 1);
        toast.info(`Needs work: ${feedback}`);
      }
      
      startRound();
    } catch (error) {
      console.error(error);
      toast.error("Failed to validate equation");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-fuchsia-900 to-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-white">
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-fuchsia-400" style={{ fontFamily: "'Cinzel', serif" }}>
            🧮 EQUATION BUILDER
          </h1>
          <div className="text-right">
            <div className="text-fuchsia-400 text-3xl font-bold">{score}</div>
            <div className="text-fuchsia-200/60 text-sm">POINTS</div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          <Card className="bg-black/40 border-fuchsia-500/50">
            <CardHeader>
              <CardTitle className="text-fuchsia-300">Doctrine Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-fuchsia-100 font-bold text-center py-4">
                {currentPrompt}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-fuchsia-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-fuchsia-300">
                <Calculator className="w-5 h-5" />
                Your Equation (3-5 pieces)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black/60 border border-fuchsia-500/30 rounded-lg p-4 min-h-20 flex items-center gap-2 mb-4">
                {selectedPieces.length === 0 ? (
                  <span className="text-fuchsia-200/40">Click pieces below to build equation...</span>
                ) : (
                  selectedPieces.map((piece, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => removePiece(idx)}
                      className="text-lg font-bold"
                    >
                      {piece}
                    </Button>
                  ))
                )}
              </div>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {availablePieces.map((piece, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    onClick={() => addPiece(piece)}
                    className="h-12 text-sm font-bold border border-fuchsia-500/30 hover:border-fuchsia-500"
                    disabled={selectedPieces.length >= 5}
                  >
                    {piece}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-fuchsia-500/50">
            <CardHeader>
              <CardTitle className="text-fuchsia-300">Explain Your Equation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain what each piece means and how your equation answers the doctrine challenge..."
                className="bg-black/60 border-fuchsia-500/30 text-white min-h-32"
              />
              
              {/* Share Buttons */}
              {selectedPieces.length >= 3 && explanation.trim() && (
                <div className="flex gap-2">
                  <TextShareButton
                    type="equation"
                    title={`Equation: ${selectedPieces.join(" ")}`}
                    description={currentPrompt}
                    variant="outline"
                    className="flex-1 border-fuchsia-500/30 hover:bg-fuchsia-500/10"
                  />
                  <Button
                    onClick={shareEquationToCommunity}
                    variant="outline"
                    className="flex-1 border-fuchsia-500/30 hover:bg-fuchsia-500/10"
                    disabled={sharingToCommunity}
                  >
                    {sharingToCommunity ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share to Community
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Validating..." : "Submit Equation"}
                </Button>
                <Button onClick={startRound} variant="outline">
                  New Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
