import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  BookOpen, Calendar, Share2,
  MessageSquare, CheckCircle, Users, Copy,
  ThumbsUp, Heart, HelpCircle, Lightbulb,
  ChevronDown, Send, Reply, Bot, Loader2,
  Sparkles, BookMarked, Link2, Telescope
} from "lucide-react";
import { format } from "date-fns";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface StudyFeedProps {
  churchId: string;
}

interface CentralStudy {
  id: string;
  title: string;
  description: string | null;
  week_start: string;
  week_end: string;
  status: 'draft' | 'active' | 'completed';
  key_passages: string[];
  guided_questions: string[];
  christ_synthesis: string;
  action_challenge: string;
  prayer_focus: string;
  seeker_friendly_framing: string | null;
  share_token: string | null;
}

interface StudyResponse {
  id: string;
  study_id: string;
  user_id: string;
  user_name: string;
  avatar_url: string | null;
  response_type: string;
  content: string;
  suggestion_action: string | null;
  suggestion_target: string | null;
  parent_id: string | null;
  helpful_count: number;
  created_at: string;
}

interface StudyReaction {
  study_id: string;
  target_type: string;
  target_index: number | null;
  target_id: string | null;
  reaction: string;
  count: number;
  user_reacted: boolean;
}

type SuggestionAction = 'expound' | 'apply_principle' | 'explore_passage' | 'connect_theme';

const REACTION_ICONS: Record<string, { icon: typeof Heart; label: string }> = {
  amen: { icon: Heart, label: "Amen" },
  convicted: { icon: Sparkles, label: "Convicted" },
  helpful: { icon: ThumbsUp, label: "Helpful" },
  question: { icon: HelpCircle, label: "?" },
};

const SUGGESTION_OPTIONS: { action: SuggestionAction; label: string; icon: typeof Telescope; description: string }[] = [
  { action: 'expound', label: 'Expound on this', icon: Telescope, description: 'Ask Jeeves to go deeper on this question' },
  { action: 'apply_principle', label: 'Apply a principle', icon: BookMarked, description: 'Apply a Palace principle to this question' },
  { action: 'explore_passage', label: 'Explore this passage', icon: BookOpen, description: 'Dive into the scripture reference' },
  { action: 'connect_theme', label: 'Connect a theme', icon: Link2, description: 'Find related themes across Scripture' },
];

export function StudyFeed({ churchId }: StudyFeedProps) {
  const [currentStudy, setCurrentStudy] = useState<CentralStudy | null>(null);
  const [pastStudies, setPastStudies] = useState<CentralStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState<CentralStudy | null>(null);

  // Interactive state
  const [responses, setResponses] = useState<StudyResponse[]>([]);
  const [reactions, setReactions] = useState<Record<string, StudyReaction>>({});
  const [newResponseText, setNewResponseText] = useState("");
  const [newResponseType, setNewResponseType] = useState<'insight' | 'question' | 'testimony'>('insight');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [discussionFilter, setDiscussionFilter] = useState("all");
  const [suggestionLoading, setSuggestionLoading] = useState<string | null>(null);
  const [suggestionResults, setSuggestionResults] = useState<Record<string, string>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("Anonymous");

  useEffect(() => {
    loadStudies();
    loadCurrentUser();
  }, [churchId]);

  // Load responses & reactions when study changes
  useEffect(() => {
    if (currentStudy) {
      loadResponses(currentStudy.id);
      loadReactions(currentStudy.id);
      subscribeToUpdates(currentStudy.id);
    }
  }, [currentStudy?.id]);

  const loadCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
      // Try to get display name from profile
      const { data: profile } = await (supabase
        .from('profiles' as any)
        .select('display_name, full_name')
        .eq('id', user.id)
        .single() as any);
      if (profile) {
        setCurrentUserName((profile as any).display_name || (profile as any).full_name || user.email?.split('@')[0] || 'Member');
      } else {
        setCurrentUserName(user.email?.split('@')[0] || 'Member');
      }
    }
  };

  const loadStudies = async () => {
    try {
      const { data: active } = await (supabase
        .from('church_central_studies' as any)
        .select('*')
        .eq('church_id', churchId)
        .eq('status', 'active')
        .order('week_start', { ascending: false })
        .limit(1)
        .maybeSingle() as any);

      if (active) {
        setCurrentStudy(active as CentralStudy);
      }

      const { data: past } = await (supabase
        .from('church_central_studies' as any)
        .select('*')
        .eq('church_id', churchId)
        .eq('status', 'completed')
        .order('week_start', { ascending: false })
        .limit(12) as any);

      setPastStudies((past || []) as CentralStudy[]);
    } catch (error) {
      console.error('Error loading studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResponses = async (studyId: string) => {
    try {
      const { data } = await (supabase
        .from('study_responses' as any)
        .select('*')
        .eq('study_id', studyId)
        .order('created_at', { ascending: true }) as any);
      setResponses((data || []) as StudyResponse[]);
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  const loadReactions = async (studyId: string) => {
    try {
      const { data } = await (supabase
        .from('study_reactions' as any)
        .select('*')
        .eq('study_id', studyId) as any);

      // Aggregate reactions
      const reactionMap: Record<string, StudyReaction> = {};
      const rawReactions = (data || []) as any[];
      for (const r of rawReactions) {
        const key = `${r.target_type}-${r.target_index ?? 'null'}-${r.target_id ?? 'null'}-${r.reaction}`;
        if (!reactionMap[key]) {
          reactionMap[key] = {
            study_id: r.study_id,
            target_type: r.target_type,
            target_index: r.target_index,
            target_id: r.target_id,
            reaction: r.reaction,
            count: 0,
            user_reacted: false,
          };
        }
        reactionMap[key].count++;
        if (r.user_id === currentUserId) {
          reactionMap[key].user_reacted = true;
        }
      }
      setReactions(reactionMap);
    } catch (error) {
      console.error('Error loading reactions:', error);
    }
  };

  const subscribeToUpdates = useCallback((studyId: string) => {
    const channel = supabase.channel(`study-${studyId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'study_responses',
        filter: `study_id=eq.${studyId}`,
      }, () => {
        loadResponses(studyId);
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'study_reactions',
        filter: `study_id=eq.${studyId}`,
      }, () => {
        loadReactions(studyId);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUserId]);

  const toggleReaction = async (
    studyId: string,
    targetType: string,
    targetIndex: number | null,
    targetId: string | null,
    reaction: string
  ) => {
    if (!currentUserId) {
      toast.error("Please sign in to react");
      return;
    }

    const key = `${targetType}-${targetIndex ?? 'null'}-${targetId ?? 'null'}-${reaction}`;
    const existing = reactions[key];

    if (existing?.user_reacted) {
      // Remove reaction
      await (supabase
        .from('study_reactions' as any)
        .delete()
        .eq('study_id', studyId)
        .eq('user_id', currentUserId)
        .eq('target_type', targetType)
        .eq('reaction', reaction)
        .is('target_index', targetIndex)
        .is('target_id', targetId) as any);
    } else {
      // Add reaction
      await (supabase
        .from('study_reactions' as any)
        .insert({
          study_id: studyId,
          user_id: currentUserId,
          target_type: targetType,
          target_index: targetIndex,
          target_id: targetId,
          reaction,
        }) as any);
    }

    loadReactions(studyId);
  };

  const getReactionCount = (
    targetType: string,
    targetIndex: number | null,
    targetId: string | null,
    reaction: string
  ): { count: number; active: boolean } => {
    const key = `${targetType}-${targetIndex ?? 'null'}-${targetId ?? 'null'}-${reaction}`;
    const r = reactions[key];
    return { count: r?.count || 0, active: r?.user_reacted || false };
  };

  const submitResponse = async (studyId: string, parentId?: string) => {
    const text = parentId ? replyText : newResponseText;
    if (!text.trim() || !currentUserId) {
      toast.error(!currentUserId ? "Please sign in" : "Please enter a response");
      return;
    }

    setSubmittingResponse(true);
    try {
      await (supabase
        .from('study_responses' as any)
        .insert({
          study_id: studyId,
          user_id: currentUserId,
          user_name: currentUserName,
          response_type: parentId ? 'insight' : newResponseType,
          content: text.trim(),
          parent_id: parentId || null,
        }) as any);

      if (parentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setNewResponseText("");
      }
      toast.success("Response shared!");
      loadResponses(studyId);
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error("Failed to submit response");
    } finally {
      setSubmittingResponse(false);
    }
  };

  const handleSuggestion = async (
    studyId: string,
    question: string,
    questionIndex: number,
    action: SuggestionAction,
    keyPassages: string[]
  ) => {
    const suggestionKey = `${questionIndex}-${action}`;
    if (suggestionResults[suggestionKey]) return; // Already fetched

    setSuggestionLoading(suggestionKey);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "study_suggestion",
          study_title: currentStudy?.title || "Weekly Study",
          question,
          suggestion_action: action,
          key_passages: keyPassages,
        },
      });

      if (error) throw error;

      const content = data?.content || data?.rawContent || "Unable to generate suggestion.";
      setSuggestionResults(prev => ({ ...prev, [suggestionKey]: content }));

      // Save as a suggestion response
      if (currentUserId) {
        await (supabase
          .from('study_responses' as any)
          .insert({
            study_id: studyId,
            user_id: currentUserId,
            user_name: "Jeeves",
            response_type: "suggestion",
            content,
            suggestion_action: action,
            suggestion_target: question,
          }) as any);
      }
    } catch (error) {
      console.error('Error fetching suggestion:', error);
      toast.error("Failed to get suggestion from Jeeves");
    } finally {
      setSuggestionLoading(null);
    }
  };

  const handleShare = (study: CentralStudy) => {
    setSelectedStudy(study);
    setShareDialogOpen(true);
  };

  const copyShareLink = () => {
    if (!selectedStudy) return;
    const link = `${window.location.origin}/study/${selectedStudy.share_token || selectedStudy.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Share link copied!");
  };

  const shareToFriend = (platform: string) => {
    if (!selectedStudy) return;
    const link = `${window.location.origin}/study/${selectedStudy.share_token || selectedStudy.id}`;
    const text = `Check out this Bible study: "${selectedStudy.title}" - We're studying ${selectedStudy.key_passages?.join(', ') || 'Scripture'} this week!`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(selectedStudy.title)}&body=${encodeURIComponent(text + '\n\n' + link)}`, '_blank');
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(text + ' ' + link)}`, '_blank');
        break;
    }
    toast.success(`Opening ${platform}...`);
  };

  // Reaction chips for a target
  const ReactionChips = ({ studyId, targetType, targetIndex, targetId }: {
    studyId: string;
    targetType: string;
    targetIndex: number | null;
    targetId: string | null;
  }) => (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {Object.entries(REACTION_ICONS).map(([key, { icon: Icon, label }]) => {
        const { count, active } = getReactionCount(targetType, targetIndex, targetId, key);
        return (
          <button
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              toggleReaction(studyId, targetType, targetIndex, targetId, key);
            }}
            className={`
              inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
              transition-all duration-200 border
              ${active
                ? 'bg-primary/15 border-primary/40 text-primary'
                : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted hover:border-muted-foreground/20'}
            `}
          >
            <Icon className="h-3 w-3" />
            <span>{label}</span>
            {count > 0 && <span className="ml-0.5 text-[10px] opacity-80">{count}</span>}
          </button>
        );
      })}
    </div>
  );

  // Suggestion dropdown for a question
  const SuggestionButton = ({ studyId, question, questionIndex, keyPassages }: {
    studyId: string;
    question: string;
    questionIndex: number;
    keyPassages: string[];
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground hover:text-primary">
          <Lightbulb className="h-3 w-3" />
          Suggest
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          {SUGGESTION_OPTIONS.map(({ action, label, icon: Icon, description }) => {
            const key = `${questionIndex}-${action}`;
            const isLoading = suggestionLoading === key;
            return (
              <button
                key={action}
                onClick={() => handleSuggestion(studyId, question, questionIndex, action, keyPassages)}
                disabled={isLoading || !!suggestionResults[key]}
                className="w-full flex items-start gap-2 p-2 rounded-lg text-left text-sm hover:bg-muted/50 transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-4 w-4 mt-0.5 animate-spin text-primary" /> : <Icon className="h-4 w-4 mt-0.5 text-primary" />}
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-muted-foreground">{description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );

  const StudyCard = ({ study, isActive = false }: { study: CentralStudy; isActive?: boolean }) => {
    const topLevelResponses = responses.filter(r => !r.parent_id && r.study_id === study.id);
    const filteredResponses = discussionFilter === 'all'
      ? topLevelResponses
      : topLevelResponses.filter(r => r.response_type === discussionFilter);

    return (
      <div className="space-y-4">
        <Card variant="glass" className={isActive ? "border-primary/50" : ""}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {isActive && <Badge className="bg-green-500">This Week</Badge>}
                  <Badge variant="outline">
                    {format(new Date(study.week_start), 'MMM d')} - {format(new Date(study.week_end), 'MMM d')}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{study.title}</CardTitle>
                {study.description && (
                  <CardDescription className="mt-2">{study.description}</CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Key Passages */}
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Key Passages
              </h4>
              <div className="flex flex-wrap gap-2">
                {(study.key_passages || []).map((passage, i) => (
                  <Badge key={i} variant="outline">{passage}</Badge>
                ))}
              </div>
            </div>

            {/* Guided Questions with Reactions & Suggestions */}
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Discussion Questions
              </h4>
              <ul className="space-y-3 text-sm">
                {(study.guided_questions || []).map((q, i) => (
                  <li key={i} className="space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="text-primary font-medium">{i + 1}.</span>
                      <div className="flex-1">
                        <span className="text-muted-foreground">{q}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <ReactionChips
                            studyId={study.id}
                            targetType="question"
                            targetIndex={i}
                            targetId={null}
                          />
                          <SuggestionButton
                            studyId={study.id}
                            question={q}
                            questionIndex={i}
                            keyPassages={study.key_passages || []}
                          />
                        </div>
                        {/* Inline suggestion result */}
                        {Object.entries(suggestionResults)
                          .filter(([key]) => key.startsWith(`${i}-`))
                          .map(([key, content]) => (
                            <div key={key} className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Bot className="h-3.5 w-3.5 text-primary" />
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Jeeves</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground prose prose-sm max-w-none">
                                {formatJeevesResponse(content)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Christ Synthesis with reactions */}
            {study.christ_synthesis && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-medium text-sm mb-1">Christ-Centered Truth</h4>
                <p className="text-sm text-muted-foreground">{study.christ_synthesis}</p>
                <ReactionChips
                  studyId={study.id}
                  targetType="synthesis"
                  targetIndex={null}
                  targetId={null}
                />
              </div>
            )}

            {/* Action & Prayer */}
            <div className="grid gap-3 md:grid-cols-2">
              {study.action_challenge && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm mb-1 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Action Challenge
                  </h4>
                  <p className="text-sm text-muted-foreground">{study.action_challenge}</p>
                  <ReactionChips
                    studyId={study.id}
                    targetType="challenge"
                    targetIndex={null}
                    targetId={null}
                  />
                </div>
              )}
              {study.prayer_focus && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm mb-1">Prayer Focus</h4>
                  <p className="text-sm text-muted-foreground">{study.prayer_focus}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare(study)}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share with Friend
              </Button>
              {study.seeker_friendly_framing && (
                <Badge variant="outline" className="bg-amber-500/10 text-amber-600">
                  <Users className="h-3 w-3 mr-1" />
                  Seeker-Friendly Version
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Discussion Section */}
        {isActive && (
          <Card variant="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Discussion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Share Your Insight input */}
              <div className="p-3 rounded-lg border bg-muted/30 space-y-3">
                <Textarea
                  value={newResponseText}
                  onChange={(e) => setNewResponseText(e.target.value)}
                  placeholder="Share an insight, question, or testimony..."
                  className="min-h-[80px] resize-none bg-background"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {(['insight', 'question', 'testimony'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setNewResponseType(type)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                          newResponseType === type
                            ? 'bg-primary/15 border-primary/40 text-primary'
                            : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => submitResponse(study.id)}
                    disabled={!newResponseText.trim() || submittingResponse}
                    className="gap-1"
                  >
                    {submittingResponse ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Share
                  </Button>
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex gap-1.5 overflow-x-auto">
                {['all', 'insight', 'question', 'testimony', 'suggestion'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDiscussionFilter(filter)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                      discussionFilter === filter
                        ? 'bg-primary/15 border-primary/40 text-primary'
                        : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1) + 's'}
                  </button>
                ))}
              </div>

              {/* Response list */}
              <div className="space-y-3">
                {filteredResponses.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    No responses yet. Be the first to share!
                  </p>
                ) : (
                  filteredResponses.map((response) => {
                    const replies = responses.filter(r => r.parent_id === response.id);
                    const isJeeves = response.user_name === "Jeeves";
                    return (
                      <div key={response.id} className="space-y-2">
                        <div className={`p-3 rounded-lg border ${isJeeves ? 'bg-primary/5 border-primary/20' : 'bg-muted/30'}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            {isJeeves ? (
                              <Bot className="h-4 w-4 text-primary" />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                {response.user_name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="text-sm font-medium">{response.user_name}</span>
                            {isJeeves && <Badge variant="outline" className="text-[10px] px-1.5 py-0">AI</Badge>}
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {response.response_type}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {format(new Date(response.created_at), 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {isJeeves ? formatJeevesResponse(response.content) : response.content}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => toggleReaction(study.id, 'response', null, response.id, 'helpful')}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all border ${
                                getReactionCount('response', null, response.id, 'helpful').active
                                  ? 'bg-primary/15 border-primary/40 text-primary'
                                  : 'bg-muted/50 border-transparent text-muted-foreground hover:bg-muted'
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              Helpful
                              {getReactionCount('response', null, response.id, 'helpful').count > 0 && (
                                <span className="text-[10px]">{getReactionCount('response', null, response.id, 'helpful').count}</span>
                              )}
                            </button>
                            {!isJeeves && (
                              <button
                                onClick={() => setReplyingTo(replyingTo === response.id ? null : response.id)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-muted-foreground hover:bg-muted border border-transparent"
                              >
                                <Reply className="h-3 w-3" />
                                Reply
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Threaded replies */}
                        {replies.length > 0 && (
                          <div className="ml-6 space-y-2 border-l-2 border-muted pl-3">
                            {replies.map((reply) => (
                              <div key={reply.id} className="p-2 rounded-lg bg-muted/20 text-sm">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {reply.user_name.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="text-xs font-medium">{reply.user_name}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {format(new Date(reply.created_at), 'MMM d, h:mm a')}
                                  </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply input */}
                        {replyingTo === response.id && (
                          <div className="ml-6 flex gap-2">
                            <input
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              className="flex-1 px-3 py-1.5 text-sm rounded-lg border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  submitResponse(study.id, response.id);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => submitResponse(study.id, response.id)}
                              disabled={!replyText.trim() || submittingResponse}
                            >
                              <Send className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          Central Study Feed
        </h2>
        <p className="text-muted-foreground">
          One sermon → One study → All groups study together
        </p>
      </div>

      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">This Week</TabsTrigger>
          <TabsTrigger value="archive">Past Studies</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          {currentStudy ? (
            <StudyCard study={currentStudy} isActive />
          ) : (
            <Card variant="glass">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Study</h3>
                <p className="text-muted-foreground">
                  The central study for this week hasn't been released yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="archive">
          {pastStudies.length === 0 ? (
            <Card variant="glass">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Past Studies</h3>
                <p className="text-muted-foreground">
                  Previous studies will appear here after they're completed.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastStudies.map(study => (
                <StudyCard key={study.id} study={study} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Share This Study
            </DialogTitle>
            <DialogDescription>
              Invite a friend to explore this Bible study—perfect for non-SDA seekers!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedStudy?.seeker_friendly_framing && (
              <Card className="bg-amber-500/5 border-amber-500/20">
                <CardContent className="py-3">
                  <p className="text-sm font-medium text-amber-600 mb-1">
                    Seeker-Friendly Version Available
                  </p>
                  <p className="text-xs text-muted-foreground">
                    This study includes approachable framing for friends new to faith.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-3">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => shareToFriend('whatsapp')}
              >
                <span className="mr-3">Share via WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => shareToFriend('sms')}
              >
                <span className="mr-3">Share via Text Message</span>
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => shareToFriend('email')}
              >
                <span className="mr-3">Share via Email</span>
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={copyShareLink}
              >
                <Copy className="h-4 w-4 mr-3" />
                Copy Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
