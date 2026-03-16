import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, ThumbsUp, Star, Zap, Send, Loader2, Trophy, Plus, Filter, ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { QuickAudioButton } from "@/components/audio/QuickAudioButton";

interface Discovery {
  id: string;
  user_id: string;
  title: string;
  discovery_text: string;
  category: string;
  scripture_refs: string[];
  ai_score: number;
  ai_analysis: string;
  votes_count: number;
  created_at: string;
  user_vote?: string | null;
}

interface LeaderboardEntry {
  user_id: string;
  total_votes: number;
}

const DISCOVERY_CATEGORIES = [
  "Typology", "Prophecy", "Hebrew/Greek Insight", "Cross-Reference",
  "Sanctuary Connection", "Character Study", "Historical Context", "Doctrinal Defense",
];

export function BibleDiscoveryBoard() {
  const { user } = useAuth();

  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitTitle, setSubmitTitle] = useState("");
  const [submitText, setSubmitText] = useState("");
  const [submitCategory, setSubmitCategory] = useState("");
  const [submitScriptureRefs, setSubmitScriptureRefs] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [sortBy, setSortBy] = useState<"votes" | "recent">("votes");
  const [filterCategory, setFilterCategory] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [expandedAnalysis, setExpandedAnalysis] = useState<string | null>(null);

  const loadDiscoveries = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("bible_discoveries")
        .select("*")
        .order(sortBy === "votes" ? "votes_count" : "created_at", { ascending: false })
        .limit(50);
      if (error) throw error;

      // Load user's votes
      if (user) {
        const { data: votes } = await (supabase as any)
          .from("bible_discovery_votes")
          .select("discovery_id, vote_type")
          .eq("user_id", user.id);

        const voteMap = new Map((votes || []).map((v: any) => [v.discovery_id, v.vote_type]));
        setDiscoveries((data || []).map((d: any) => ({ ...d, user_vote: voteMap.get(d.id) || null })));
      } else {
        setDiscoveries(data || []);
      }
    } catch (e) {
      console.error("Failed to load discoveries:", e);
    } finally {
      setLoading(false);
    }
  }, [sortBy, user]);

  const loadLeaderboard = useCallback(async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("bible_discoveries")
        .select("user_id, votes_count");
      if (error) throw error;

      const totals = new Map<string, number>();
      (data || []).forEach((d: any) => {
        totals.set(d.user_id, (totals.get(d.user_id) || 0) + (d.votes_count || 0));
      });

      const entries: LeaderboardEntry[] = Array.from(totals.entries())
        .map(([user_id, total_votes]) => ({ user_id, total_votes }))
        .sort((a, b) => b.total_votes - a.total_votes)
        .slice(0, 10);

      setLeaderboard(entries);
    } catch (e) {
      console.error("Failed to load leaderboard:", e);
    }
  }, []);

  useEffect(() => {
    loadDiscoveries();
  }, [loadDiscoveries]);

  useEffect(() => {
    if (showLeaderboard) loadLeaderboard();
  }, [showLeaderboard, loadLeaderboard]);

  const submitDiscovery = async () => {
    if (!user || !submitTitle.trim() || !submitText.trim() || !submitCategory) return;
    setSubmitLoading(true);
    try {
      // Get AI evaluation
      const { data: aiData, error: aiError } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "defense-discovery-evaluate",
          title: submitTitle.trim(),
          discoveryText: submitText.trim(),
          category: submitCategory,
          scriptureRefs: submitScriptureRefs.trim(),
        },
      });
      if (aiError) throw aiError;

      const content = aiData?.content || "";
      const scoreMatch = content.match(/SCORE:\s*(\d+)/i);
      const aiScore = scoreMatch ? parseInt(scoreMatch[1], 10) : 70;

      // Insert discovery
      const refs = submitScriptureRefs.split(",").map((r: string) => r.trim()).filter(Boolean);
      await (supabase as any).from("bible_discoveries").insert({
        user_id: user.id,
        title: submitTitle.trim(),
        discovery_text: submitText.trim(),
        category: submitCategory,
        scripture_refs: refs,
        ai_score: aiScore,
        ai_analysis: content,
        votes_count: 0,
      });

      setShowSubmitDialog(false);
      setSubmitTitle("");
      setSubmitText("");
      setSubmitCategory("");
      setSubmitScriptureRefs("");
      loadDiscoveries();
    } catch (e) {
      console.error("Failed to submit discovery:", e);
    } finally {
      setSubmitLoading(false);
    }
  };

  const vote = async (discoveryId: string, voteType: string) => {
    if (!user) return;
    try {
      const existing = discoveries.find(d => d.id === discoveryId);
      if (existing?.user_vote === voteType) {
        // Remove vote
        await (supabase as any).from("bible_discovery_votes").delete()
          .eq("discovery_id", discoveryId).eq("user_id", user.id);
        await (supabase as any).from("bible_discoveries")
          .update({ votes_count: Math.max(0, (existing.votes_count || 1) - 1) })
          .eq("id", discoveryId);
      } else {
        // Upsert vote
        await (supabase as any).from("bible_discovery_votes").upsert({
          discovery_id: discoveryId,
          user_id: user.id,
          vote_type: voteType,
        }, { onConflict: "discovery_id,user_id" });

        const increment = existing?.user_vote ? 0 : 1;
        if (increment > 0) {
          await (supabase as any).from("bible_discoveries")
            .update({ votes_count: (existing?.votes_count || 0) + 1 })
            .eq("id", discoveryId);
        }
      }
      loadDiscoveries();
    } catch (e) {
      console.error("Vote error:", e);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-600/80 text-green-100";
    if (score >= 60) return "bg-amber-600/80 text-amber-100";
    return "bg-red-600/80 text-red-100";
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const filteredDiscoveries = filterCategory
    ? discoveries.filter(d => d.category === filterCategory)
    : discoveries;

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto p-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-600 to-amber-600">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Bible Discovery Board</h2>
          <p className="text-sm text-white/60">Share your Scripture discoveries and upvote the best insights</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          onClick={() => setShowSubmitDialog(true)}
          className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Share Discovery
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSortBy(sortBy === "votes" ? "recent" : "votes")}
          className="text-white/70 hover:text-white"
        >
          {sortBy === "votes" ? "Top Voted" : "Most Recent"}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterCategory(filterCategory ? "" : DISCOVERY_CATEGORIES[0])}
            className="text-white/70 hover:text-white"
          >
            <Filter className="w-3 h-3 mr-1" />
            {filterCategory || "All Categories"}
          </Button>
          {filterCategory && (
            <div className="absolute top-full left-0 mt-1 z-20 bg-black/90 border border-white/10 rounded-lg p-1 flex flex-col gap-0.5 min-w-[180px]">
              <button
                onClick={() => setFilterCategory("")}
                className="text-left text-xs px-2 py-1.5 rounded text-white/70 hover:bg-white/10"
              >
                All Categories
              </button>
              {DISCOVERY_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`text-left text-xs px-2 py-1.5 rounded ${
                    filterCategory === cat ? "bg-yellow-600/30 text-yellow-300" : "text-white/70 hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="text-white/70 hover:text-white ml-auto"
        >
          <Trophy className="w-4 h-4 mr-1 text-yellow-400" />
          Leaderboard
        </Button>
      </div>

      {/* Leaderboard Panel */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-black/40 border-yellow-600/30 backdrop-blur-sm">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  Top Discoverers
                </h3>
                {leaderboard.length === 0 ? (
                  <p className="text-xs text-white/40">No discoveries yet. Be the first!</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {leaderboard.map((entry, i) => (
                      <div key={entry.user_id} className="flex items-center gap-2 text-sm">
                        <span className={`font-bold w-5 text-center ${
                          i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-white/50"
                        }`}>
                          {i + 1}
                        </span>
                        <span className="text-white/70 truncate flex-1">
                          {entry.user_id.slice(0, 8)}...
                        </span>
                        <span className="text-yellow-400 font-semibold">{entry.total_votes} votes</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovery Feed */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
        </div>
      ) : filteredDiscoveries.length === 0 ? (
        <div className="text-center py-12 text-white/40">
          <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No discoveries yet. Share your first insight!</p>
        </div>
      ) : (
        <ScrollArea className="h-[60vh]">
          <div className="flex flex-col gap-3 pr-2">
            <AnimatePresence>
              {filteredDiscoveries.map((d, i) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="bg-black/40 border-white/10 backdrop-blur-sm hover:border-white/20 transition-colors">
                    <CardContent className="p-4">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">{d.title}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-[10px] border-yellow-600/40 text-yellow-300">
                              {d.category}
                            </Badge>
                            <Badge className={`text-[10px] ${getScoreColor(d.ai_score)}`}>
                              AI: {d.ai_score}/100
                            </Badge>
                          </div>
                        </div>
                        <QuickAudioButton text={d.discovery_text} size="sm" />
                      </div>

                      {/* Discovery Text */}
                      <div className="text-sm text-white/70 mb-2 line-clamp-4">
                        <ReactMarkdown>{d.discovery_text}</ReactMarkdown>
                      </div>

                      {/* Scripture Refs */}
                      {d.scripture_refs && d.scripture_refs.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {d.scripture_refs.map((ref, ri) => (
                            <Badge
                              key={ri}
                              variant="outline"
                              className="text-[10px] border-white/10 text-white/50"
                            >
                              {ref}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* AI Analysis Expandable */}
                      {d.ai_analysis && (
                        <div className="mb-2">
                          <button
                            onClick={() => setExpandedAnalysis(expandedAnalysis === d.id ? null : d.id)}
                            className="text-xs text-yellow-400/70 hover:text-yellow-400 transition-colors"
                          >
                            {expandedAnalysis === d.id ? "Hide AI Analysis" : "Show AI Analysis"}
                          </button>
                          <AnimatePresence>
                            {expandedAnalysis === d.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2 p-2 rounded bg-white/5 text-xs text-white/60">
                                  <ReactMarkdown>{d.ai_analysis}</ReactMarkdown>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Footer: Votes + Timestamp */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => vote(d.id, "upvote")}
                            className={`h-7 px-2 ${
                              d.user_vote === "upvote"
                                ? "text-yellow-400 bg-yellow-400/10"
                                : "text-white/40 hover:text-white/70"
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => vote(d.id, "insightful")}
                            className={`h-7 px-2 ${
                              d.user_vote === "insightful"
                                ? "text-purple-400 bg-purple-400/10"
                                : "text-white/40 hover:text-white/70"
                            }`}
                          >
                            <Star className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => vote(d.id, "mind-blown")}
                            className={`h-7 px-2 ${
                              d.user_vote === "mind-blown"
                                ? "text-cyan-400 bg-cyan-400/10"
                                : "text-white/40 hover:text-white/70"
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5" />
                          </Button>
                          <span className="text-xs text-white/50 ml-1">
                            {d.votes_count || 0}
                          </span>
                        </div>
                        <span className="text-[10px] text-white/30">
                          {formatDate(d.created_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      )}

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="bg-black/95 border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-yellow-400">
              <Sparkles className="w-5 h-5" />
              Share a Bible Discovery
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 mt-2">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Title</label>
              <input
                type="text"
                value={submitTitle}
                onChange={e => setSubmitTitle(e.target.value)}
                placeholder="e.g., The Ark as a Type of Christ"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-600/50"
              />
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">Category</label>
              <select
                value={submitCategory}
                onChange={e => setSubmitCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-yellow-600/50"
              >
                <option value="" disabled>Select a category...</option>
                {DISCOVERY_CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-black text-white">{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">Your Discovery</label>
              <Textarea
                value={submitText}
                onChange={e => setSubmitText(e.target.value)}
                placeholder="Describe your insight, cross-reference, or typological connection..."
                className="min-h-[120px] bg-white/5 border-white/10 text-sm text-white placeholder:text-white/30 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-white/50 mb-1 block">Scripture References (comma-separated)</label>
              <input
                type="text"
                value={submitScriptureRefs}
                onChange={e => setSubmitScriptureRefs(e.target.value)}
                placeholder="e.g., Genesis 6:14, 1 Peter 3:20-21, Hebrews 11:7"
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-600/50"
              />
            </div>

            <Button
              onClick={submitDiscovery}
              disabled={submitLoading || !submitTitle.trim() || !submitText.trim() || !submitCategory}
              className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white"
            >
              {submitLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Discovery
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
