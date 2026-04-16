import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChefHat, ArrowLeft, Loader2, Eye, Share2, RefreshCw, Users } from "lucide-react";
import { PostToPublicChallengeButton } from "@/components/challenges/PostToPublicChallengeButton";
import { SocialShareButton } from "@/components/SocialShareButton";
import { TextShareButton } from "@/components/TextShareButton";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { ChefMultiplayerLobby } from "@/components/chef/ChefMultiplayerLobby";
import { ChefMultiplayerGame } from "@/components/chef/ChefMultiplayerGame";
import { useChefMultiplayer } from "@/hooks/useChefMultiplayer";
interface Verse {
  reference: string;
  text: string;
}
const difficultyConfig = {
  easy: {
    min: 3,
    max: 4,
    labelKey: "challenges.easyVerses",
    icon: "🌱"
  },
  intermediate: {
    min: 5,
    max: 6,
    labelKey: "challenges.intermediateVerses",
    icon: "🔥"
  },
  pro: {
    min: 10,
    max: 10,
    labelKey: "challenges.proVerses",
    icon: "💎"
  },
  master: {
    min: 10,
    max: 10,
    labelKey: "challenges.masterVerses",
    icon: "👑"
  }
};
export default function ChefChallenge() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const chefMultiplayer = useChefMultiplayer();
  const [activeTab, setActiveTab] = useState<string>("solo");
  const [difficulty, setDifficulty] = useState<keyof typeof difficultyConfig>("intermediate");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [recipe, setRecipe] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [showModelAnswer, setShowModelAnswer] = useState(false);
  const [modelAnswer, setModelAnswer] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const handleShare = () => {
    const verseRefs = verses.map(v => v.reference).join(', ');
    const text = `🧑‍🍳 Help me make this Chef Challenge dish!\n\nI need to tie these ${verses.length} random verses together:\n${verseRefs}\n\nCan you help me create a creative Bible study?`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'Chef Challenge - Help Me!',
        text: text,
        url: url
      }).catch(() => {
        // Fallback to copying
        navigator.clipboard.writeText(`${text}\n\n${url}`);
        toast.success(t('challenges.challengeCopied'));
      });
    } else {
      navigator.clipboard.writeText(`${text}\n\n${url}`);
      toast.success(t('challenges.challengeCopied'));
    }
  };
  const generateVerses = async () => {
    setIsLoading(true);
    setVerses([]);
    setRecipe("");
    setFeedback(null);
    setShowModelAnswer(false);
    setModelAnswer("");
    setHasSubmitted(false);
    try {
      const config = difficultyConfig[difficulty];
      console.log("=== CALLING JEEVES TO GENERATE VERSES ===");
      console.log("Config:", {
        min: config.min,
        max: config.max,
        difficulty
      });
      const {
        data,
        error
      } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "generate_chef_verses",
          minVerses: config.min,
          maxVerses: config.max,
          difficulty
        }
      });
      console.log("=== JEEVES RESPONSE ===");
      console.log("Error:", error);
      console.log("Data:", data);
      if (error) {
        console.error("Jeeves error details:", error);
        throw new Error(error.message || "Failed to call Jeeves");
      }
      if (!data) {
        throw new Error("No data returned from Jeeves");
      }
      if (!data.verses || !Array.isArray(data.verses)) {
        console.error("Invalid data structure:", data);
        throw new Error("Invalid response format - missing verses array");
      }
      if (data.verses.length === 0) {
        throw new Error("Jeeves returned empty verses array");
      }
      console.log("Successfully received verses:", data.verses);
      setVerses(data.verses as Verse[]);
      toast.success(t('challenges.ingredientsReady'), {
        description: t('challenges.versesGenerated', { count: data.verses.length })
      });
    } catch (error: any) {
      console.error("=== ERROR GENERATING VERSES ===");
      console.error("Error message:", error.message);
      toast.error(t('challenges.failedToGenerateIngredients'), {
        description: error.message || t('challenges.unableToGenerateVerses')
      });
      setVerses([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCheck = async () => {
    if (!recipe.trim()) {
      toast.error(t('challenges.noRecipe'), {
        description: t('challenges.writeRecipeFirst')
      });
      return;
    }
    setIsChecking(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "check_chef_recipe",
          recipe: recipe.trim(),
          verses,
          difficulty
        }
      });
      if (error) throw error;
      setFeedback(data);
      toast.success(t('challenges.recipeChecked'), {
        description: data.feedback || t('challenges.greatWork')
      });
    } catch (error) {
      console.error("Error checking recipe:", error);
      toast.error(t('common.error'), {
        description: t('challenges.failedToCheckRecipe')
      });
    } finally {
      setIsChecking(false);
    }
  };
  const handleShowModelAnswer = async () => {
    if (modelAnswer) {
      setShowModelAnswer(!showModelAnswer);
      return;
    }
    setIsLoadingModel(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "get_chef_model_answer",
          verses,
          difficulty
        }
      });
      if (error) throw error;
      setModelAnswer(data.modelAnswer || "");
      setShowModelAnswer(true);
    } catch (error) {
      console.error("Error getting model answer:", error);
      toast.error(t('common.error'), {
        description: t('challenges.failedToGetModelAnswer')
      });
    } finally {
      setIsLoadingModel(false);
    }
  };
  const handleSubmit = async () => {
    if (!recipe.trim() || !user) return;
    setIsLoading(true);
    try {
      const submissionData = {
        user_id: user.id,
        content: recipe.trim(),
        submission_data: {
          recipe: recipe.trim(),
          verses,
          feedback,
          difficulty
        } as any,
        principle_applied: "Bible Freestyle (BF) + Concentration Room (CR)"
      };
      const {
        error: submitError
      } = await supabase.from('challenge_submissions').insert(submissionData);
      if (submitError) {
        console.error("Submission error:", submitError);
        throw submitError;
      }

      // Award 25 points for completing a challenge
      await supabase.rpc("increment_user_points", { 
        user_id: user.id, 
        points_to_add: 25 
      });

      setHasSubmitted(true);
      toast.success(t('challenges.recipeSubmitted'), {
        description: t('challenges.addedToJournal')
      });
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error(t('challenges.failedToSubmitRecipe'));
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-950 dark:via-amber-950 dark:to-yellow-950">
      <Navigation />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/games")} className="mb-6">
          <ArrowLeft className="mr-2" />
          {t('challenges.backToGames')}
        </Button>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="solo" className="gap-2">
              <ChefHat className="h-4 w-4" />
              Solo Kitchen
            </TabsTrigger>
            <TabsTrigger value="multiplayer" className="gap-2">
              <Users className="h-4 w-4" />
              Multiplayer Kitchen
            </TabsTrigger>
          </TabsList>

          {/* MULTIPLAYER TAB */}
          <TabsContent value="multiplayer" className="space-y-6">
            {chefMultiplayer.room?.status === "active" ? (
              <ChefMultiplayerGame game={chefMultiplayer} />
            ) : (
              <ChefMultiplayerLobby game={chefMultiplayer} />
            )}
          </TabsContent>

          {/* SOLO TAB */}
          <TabsContent value="solo">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-orange-600" />
                <CardTitle>{t('challenges.chefChallengeTitle')}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{t('challenges.quickTime')}</Badge>
                {verses.length > 0 && (
                  <>
                    <TextShareButton
                      type="chef"
                      title={`Chef Challenge with ${verses.length} random verses`}
                      description={verses.slice(0, 3).map(v => v.reference).join(", ") + (verses.length > 3 ? ` and ${verses.length - 3} more!` : "")}
                      data={{ verseCount: verses.length }}
                      variant="outline"
                      size="sm"
                    />
                    <SocialShareButton
                      title="🍳 Chef Challenge - Help Me Make a Bible Study Recipe!"
                      description={`🧑‍🍳 Can you help me with this Chef Challenge on Phototheology?\n\n🎲 I've been given ${verses.length} completely RANDOM Bible verses that seem totally unrelated:\n\n📖 ${verses.slice(0, 3).map(v => v.reference).join("\n📖 ")}${verses.length > 3 ? `\n📖 ...and ${verses.length - 3} more!` : ""}\n\n🎯 The Challenge: Tie them together into ONE creative, meaningful Bible study!\n\n💡 Think you can find the connections? Can you help me "cook up" something amazing from these random ingredients?\n\n✨ Join me and see what recipe we can create together!`}
                      url={window.location.href}
                      variant="dropdown"
                      size="sm"
                      buttonText="Share"
                    />
                  </>
                )}
              </div>
            </div>
            <CardDescription className="mt-2">
              {t('challenges.chefRules')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">{t('challenges.step1SelectLevel')}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["easy", "intermediate", "pro", "master"] as const).map(level => <Button key={level} variant={difficulty === level ? "default" : "outline"} onClick={() => setDifficulty(level)} className="w-full" disabled={isLoading || hasSubmitted || verses.length > 0}>
                      {difficultyConfig[level].icon} {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>)}
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {t(difficultyConfig[difficulty].labelKey)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">{t('challenges.step2GetIngredients')}</label>
                <Button onClick={generateVerses} className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading || hasSubmitted || verses.length > 0}>
                  {isLoading ? <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('challenges.jeevesSelectingVerses')}
                    </> : verses.length > 0 ? <>
                      {t('challenges.ingredientsGenerated')}
                    </> : <>
                      {t('challenges.generateIngredients')}
                    </>}
                </Button>
              </div>
            </div>

            {isLoading && verses.length === 0 ? <div className="flex flex-col items-center justify-center py-8 space-y-2">
                <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                <span className="text-sm">{t('challenges.jeevesGatheringIngredients')}</span>
              </div> : verses.length === 0 ? <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg text-center">
                <ChefHat className="h-12 w-12 mx-auto mb-3 text-orange-600" />
                <p className="font-medium mb-2">{t('challenges.readyToCook')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('challenges.selectDifficultyAndGenerate')}
                </p>
              </div> : <>
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-4 rounded-lg space-y-3 border-2 border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-lg">{t('challenges.yourIngredients', { count: verses.length })}</p>
                    <Badge variant="outline" className="bg-white dark:bg-gray-800">
                      {difficulty}
                    </Badge>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded border-2 border-orange-300 dark:border-orange-700 space-y-3">
                    {verses.map((verse, idx) => <div key={idx} className="space-y-1">
                        <p className="text-orange-600 font-bold text-sm">{verse.reference}</p>
                        <p className="text-sm italic pl-4 border-l-2 border-orange-200 dark:border-orange-800">"{verse.text}"</p>
                      </div>)}
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    {t('challenges.challengeExplanation')}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleShare} variant="outline" className="flex-1 border-orange-300 hover:bg-orange-50 dark:border-orange-700 dark:hover:bg-orange-900/20">
                      <Share2 className="mr-2 h-4 w-4" />
                      🆘 Help Me
                    </Button>
                    {!hasSubmitted && (
                      <Button 
                        onClick={generateVerses} 
                        variant="outline"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('challenges.regenerating')}
                          </>
                        ) : (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            {t('challenges.regenerate')}
                          </>
                        )}
                      </Button>
                    )}
                    <PostToPublicChallengeButton
                      challengeType="chef"
                      title={`Chef Challenge — ${verses.length} Random Verses`}
                      content={verses.map(v => `📖 **${v.reference}**\n> "${v.text}"`).join("\n\n") + "\n\n⚡ Challenge: These verses are intentionally random and unrelated! Your goal is to creatively weave them into a coherent Bible study."}
                      difficulty={difficulty}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    />
                  </div>
                </div>

                {!hasSubmitted ? <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t('challenges.createYourRecipe')}</label>

                      <p className="text-xs text-muted-foreground">
                        {t('challenges.explainConnections')}
                      </p>
                    </div>

                    {feedback && <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-2">
                        <p className="font-semibold">{t('challenges.jeevesFeedback')}</p>
                        <div className="text-sm">{formatJeevesResponse(feedback.feedback || "")}</div>
                        {feedback.rating && <div className="flex items-center gap-1">
                            {"⭐".repeat(feedback.rating)}
                            <span className="text-xs ml-2">({feedback.rating}/5)</span>
                          </div>}
                      </div>}

                    <div className="flex gap-2">
                      <Button onClick={handleCheck} variant="outline" className="flex-1" disabled={!recipe.trim() || isChecking}>
                        {isChecking ? <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('common.checking')}
                          </> : t('challenges.checkMyRecipe')}
                      </Button>
                      <Button onClick={handleShowModelAnswer} variant="secondary" className="flex-1" disabled={isLoadingModel}>
                        {isLoadingModel ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('common.loading')}
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            {showModelAnswer ? t('challenges.hideModelAnswer') : t('challenges.showModelAnswer')}
                          </>
                        )}
                      </Button>
                    </div>

                    {showModelAnswer && modelAnswer && <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg space-y-2">
                        <p className="font-semibold">{t('challenges.jeevesModelAnswer')}</p>
                        <div className="text-sm">{formatJeevesResponse(modelAnswer)}</div>
                      </div>}

                    <Button onClick={handleSubmit} className="w-full bg-orange-600 hover:bg-orange-700" disabled={!recipe.trim() || isLoading}>
                      {t('challenges.submitRecipeToJournal')}
                    </Button>
                  </> : <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center space-y-4">
                    <p className="text-green-800 dark:text-green-200">
                      {t('challenges.recipeComplete')}
                    </p>
                    <Button onClick={() => {
                setVerses([]);
                setRecipe("");
                setFeedback(null);
                setShowModelAnswer(false);
                setModelAnswer("");
                setHasSubmitted(false);
              }} variant="outline">
                      {t('challenges.startNewChallenge')}
                    </Button>
                  </div>}
              </>}
           </CardContent>
        </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>;
}