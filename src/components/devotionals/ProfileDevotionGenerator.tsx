import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Send, Copy, Check, RefreshCw, BookOpen, Church, Link2, Target, History, Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DevotionalProfile } from "@/hooks/useDevotionalProfiles";
import { useProfileDevotions, ProfileDevotion } from "@/hooks/useProfileDevotions";
import { StyledMarkdown } from "@/components/ui/styled-markdown";
import { formatDistanceToNow } from "date-fns";

interface ProfileDevotionGeneratorProps {
  profile: DevotionalProfile;
  onDevotionGenerated?: (devotion: GeneratedDevotion) => void;
}

export interface GeneratedDevotion {
  title: string;
  scripture_reference: string;
  scripture_text: string;
  devotional_body: string;
  strike_line: string;
  prayer: string;
  memory_hook: string;
  generated_for: string;
  theme_used: string | null;
  generated_at: string;
  // New Phototheology-rich fields
  sanctuary_connection?: string;
  cycle_placement?: string;
  types_and_symbols?: string[];
  cross_references?: string[];
  christ_name?: string;
  christ_action?: string;
  application?: string;
}

const SUGGESTED_THEMES = [
  "Hope in darkness",
  "Overcoming fear",
  "God's faithfulness",
  "Finding purpose",
  "Healing and restoration",
  "Trusting God's timing",
  "Forgiveness",
  "Identity in Christ",
  "Peace in anxiety",
  "Strength in weakness",
];

export function ProfileDevotionGenerator({ profile, onDevotionGenerated }: ProfileDevotionGeneratorProps) {
  const [theme, setTheme] = useState("");
  const [scripture, setScripture] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDevotion, setGeneratedDevotion] = useState<GeneratedDevotion | null>(null);
  const [copied, setCopied] = useState(false);
  const [viewingDevotion, setViewingDevotion] = useState<ProfileDevotion | null>(null);

  // Use the new persistence hook
  const { devotions, isLoading: devotionsLoading, saveDevotion, deleteDevotion, isSaving } = useProfileDevotions(profile.id);

  const generateDevotion = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-profile-devotion", {
        body: {
          profile: {
            name: profile.name,
            relationship: profile.relationship,
            age_group: profile.age_group,
            primary_issue: profile.primary_issue,
            issue_description: profile.issue_description,
            struggles: profile.struggles,
            spiritual_goals: profile.spiritual_goals,
            preferred_tone: profile.preferred_tone,
            preferred_themes: profile.preferred_themes,
            preferred_rooms: profile.preferred_rooms,
            current_situation: profile.current_situation,
            pastoral_notes: profile.pastoral_notes,
          },
          theme: theme || undefined,
          scripture: scripture || undefined,
        },
      });

      if (error) throw error;

      // Save to database for persistence
      await saveDevotion.mutateAsync({
        title: data.title,
        scripture_reference: data.scripture_reference,
        scripture_text: data.scripture_text,
        devotional_body: data.devotional_body,
        strike_line: data.strike_line,
        prayer: data.prayer,
        memory_hook: data.memory_hook,
        sanctuary_connection: data.sanctuary_connection,
        cycle_placement: data.cycle_placement,
        types_and_symbols: data.types_and_symbols,
        cross_references: data.cross_references,
        christ_name: data.christ_name,
        christ_action: data.christ_action,
        application: data.application,
        theme_used: data.theme_used,
        generated_at: data.generated_at,
      });

      setGeneratedDevotion(data);
      onDevotionGenerated?.(data);
      toast.success(`Deep Phototheology devotion generated and saved for ${profile.name}`);
    } catch (error) {
      console.error("Error generating devotion:", error);
      toast.error("Failed to generate devotion. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Convert a saved ProfileDevotion to the GeneratedDevotion format for display
  const viewSavedDevotion = (devotion: ProfileDevotion) => {
    setViewingDevotion(devotion);
    setGeneratedDevotion({
      title: devotion.title,
      scripture_reference: devotion.scripture_reference,
      scripture_text: devotion.scripture_text,
      devotional_body: devotion.devotional_body,
      strike_line: devotion.strike_line || "",
      prayer: devotion.prayer || "",
      memory_hook: devotion.memory_hook || "",
      generated_for: profile.name,
      theme_used: devotion.theme_used,
      generated_at: devotion.generated_at,
      sanctuary_connection: devotion.sanctuary_connection || undefined,
      cycle_placement: devotion.cycle_placement || undefined,
      types_and_symbols: devotion.types_and_symbols || undefined,
      cross_references: devotion.cross_references || undefined,
      christ_name: devotion.christ_name || undefined,
      christ_action: devotion.christ_action || undefined,
      application: devotion.application || undefined,
    });
  };

  const copyToClipboard = async () => {
    if (!generatedDevotion) return;
    
    let text = `${generatedDevotion.title}\n\n📖 ${generatedDevotion.scripture_reference}\n"${generatedDevotion.scripture_text}"\n\n${generatedDevotion.devotional_body}\n\n✨ ${generatedDevotion.strike_line}`;
    
    if (generatedDevotion.sanctuary_connection) {
      text += `\n\n⛪ Sanctuary Connection:\n${generatedDevotion.sanctuary_connection}`;
    }
    if (generatedDevotion.christ_name && generatedDevotion.christ_action) {
      text += `\n\n✝️ Christ Revealed:\n${generatedDevotion.christ_name} — ${generatedDevotion.christ_action}`;
    }
    if (generatedDevotion.application) {
      text += `\n\n🎯 Application:\n${generatedDevotion.application}`;
    }
    text += `\n\n🙏 Prayer:\n${generatedDevotion.prayer}`;
    text += `\n\n🧠 Memory Hook:\n${generatedDevotion.memory_hook}`;
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Full devotion copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerate = () => {
    setGeneratedDevotion(null);
    generateDevotion();
  };

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      {!generatedDevotion && (
        <>
          <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Generate Deep Phototheology Devotion for {profile.name}
              </CardTitle>
              <CardDescription>
                Christ-saturated • Sanctuary-mapped • Palace-structured • Theologically dense
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Selection */}
              <div className="space-y-2">
                <Label>Theme (optional)</Label>
                <Input
                  placeholder="e.g., Hope in darkness, Finding peace..."
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SUGGESTED_THEMES.slice(0, 5).map((t) => (
                    <Badge
                      key={t}
                      variant={theme === t ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/20 transition-colors text-xs py-1.5 px-2.5 active:scale-95"
                      onClick={() => setTheme(t)}
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Scripture (optional) */}
              <div className="space-y-2">
                <Label>Scripture Reference (optional)</Label>
                <Input
                  placeholder="e.g., Psalm 23, Isaiah 41:10... (leave blank for AI selection)"
                  value={scripture}
                  onChange={(e) => setScripture(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank and Jeeves will choose the perfect Scripture for {profile.name}'s situation
                </p>
              </div>

              {/* Profile Context Preview */}
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium">Context being used:</p>
                <div className="flex flex-wrap gap-1">
                  {profile.struggles?.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                  ))}
                  {profile.spiritual_goals?.map((g) => (
                    <Badge key={g} variant="outline" className="text-xs">{g}</Badge>
                  ))}
                  {profile.preferred_tone && (
                    <Badge variant="outline" className="text-xs">Tone: {profile.preferred_tone}</Badge>
                  )}
                </div>
              </div>

              <Button
                onClick={generateDevotion}
                disabled={isGenerating || isSaving}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Crafting Deep Phototheology Devotion...
                  </>
                ) : isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving devotion...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Deep Devotion
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Saved Devotions History */}
          {devotions && devotions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Previous Devotions for {profile.name}
                </CardTitle>
                <CardDescription>
                  {devotions.length} saved devotion{devotions.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {devotions.slice(0, 5).map((devotion) => (
                  <div
                    key={devotion.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{devotion.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{devotion.scripture_reference}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(devotion.created_at), { addSuffix: true })}</span>
                        {devotion.theme_used && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs py-0">{devotion.theme_used}</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewSavedDevotion(devotion)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteDevotion.mutate(devotion.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {devotions.length > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    + {devotions.length - 5} more devotions
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Generated Devotion Display */}
      {generatedDevotion && (
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{generatedDevotion.title}</CardTitle>
                <CardDescription className="mt-1">
                  For {profile.name} • {generatedDevotion.theme_used && `Theme: ${generatedDevotion.theme_used}`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={regenerate}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scripture */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-lg p-4 border border-amber-200/50 dark:border-amber-800/50">
              <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                📖 {generatedDevotion.scripture_reference}
              </p>
              <p className="text-amber-900 dark:text-amber-100 italic text-lg leading-relaxed">
                "{generatedDevotion.scripture_text}"
              </p>
            </div>

            {/* Devotional Body */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <StyledMarkdown content={generatedDevotion.devotional_body} />
            </div>

            {/* Strike Line */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-4 border-l-4 border-primary">
              <p className="text-lg font-medium italic text-primary">
                ✨ {generatedDevotion.strike_line}
              </p>
            </div>

            {/* Phototheology Depth Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Christ Connection */}
              {(generatedDevotion.christ_name || generatedDevotion.christ_action) && (
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 rounded-lg p-4 border border-rose-200/50 dark:border-rose-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">✝️</span>
                    <p className="font-semibold text-rose-800 dark:text-rose-200">Christ Revealed</p>
                  </div>
                  {generatedDevotion.christ_name && (
                    <p className="text-sm font-medium text-rose-700 dark:text-rose-300 mb-1">
                      {generatedDevotion.christ_name}
                    </p>
                  )}
                  {generatedDevotion.christ_action && (
                    <p className="text-sm text-rose-600 dark:text-rose-400">
                      {generatedDevotion.christ_action}
                    </p>
                  )}
                </div>
              )}

              {/* Sanctuary Connection */}
              {generatedDevotion.sanctuary_connection && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg p-4 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Church className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <p className="font-semibold text-blue-800 dark:text-blue-200">Sanctuary Station</p>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {generatedDevotion.sanctuary_connection}
                  </p>
                </div>
              )}

              {/* Cycle Placement */}
              {generatedDevotion.cycle_placement && (
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30 rounded-lg p-4 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <p className="font-semibold text-purple-800 dark:text-purple-200">Redemption Cycle</p>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {generatedDevotion.cycle_placement}
                  </p>
                </div>
              )}

              {/* Types & Symbols */}
              {generatedDevotion.types_and_symbols && generatedDevotion.types_and_symbols.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg p-4 border border-emerald-200/50 dark:border-emerald-800/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <p className="font-semibold text-emerald-800 dark:text-emerald-200">Types & Symbols</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {generatedDevotion.types_and_symbols.map((symbol, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cross References */}
            {generatedDevotion.cross_references && generatedDevotion.cross_references.length > 0 && (
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Cross References</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generatedDevotion.cross_references.map((ref, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {ref}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Application */}
            {generatedDevotion.application && (
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-lg p-4 border border-orange-200/50 dark:border-orange-800/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎯</span>
                  <p className="font-semibold text-orange-800 dark:text-orange-200">Application</p>
                </div>
                <p className="text-orange-900 dark:text-orange-100">
                  {generatedDevotion.application}
                </p>
              </div>
            )}

            {/* Prayer */}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="font-semibold mb-2">🙏 Prayer</p>
              <p className="text-muted-foreground italic">{generatedDevotion.prayer}</p>
            </div>

            {/* Memory Hook */}
            <div className="flex items-start gap-3 bg-accent/10 rounded-lg p-4">
              <span className="text-2xl">🧠</span>
              <div>
                <p className="text-sm font-medium mb-1">Memory Hook</p>
                <p className="text-muted-foreground">{generatedDevotion.memory_hook}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <Button className="flex-1" onClick={copyToClipboard}>
                <Send className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Share with {profile.name}</span>
                <span className="sm:hidden">Share</span>
              </Button>
              <Button variant="outline" onClick={() => {
                setGeneratedDevotion(null);
                setViewingDevotion(null);
              }}>
                {viewingDevotion ? "Back to List" : "Generate New"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
