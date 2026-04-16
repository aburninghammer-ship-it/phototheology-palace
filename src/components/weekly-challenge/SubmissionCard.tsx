import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  Medal,
  Award,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Sparkles,
  Target,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Submission {
  id: string;
  user_id: string;
  main_insight: string;
  scripture_connections?: string[];
  principles_applied?: string[];
  pt_principles_applied?: string[];
  practical_application?: string | null;
  supporting_evidence?: string | null;
  ai_score?: number | null;
  depth_score?: number | null;
  biblical_score?: number | null;
  pt_score?: number | null;
  clarity_score?: number | null;
  ai_feedback?: string | null;
  highlight_quotes?: string[];
  submitted_at?: string;
  rank?: number;
  profiles?: {
    display_name: string;
    avatar_url: string;
  } | any;
}

interface SubmissionCardProps {
  submission: Submission;
  isOwn?: boolean;
  showScores?: boolean;
  rank?: number;
}

export function SubmissionCard({
  submission,
  isOwn = false,
  showScores = false,
  rank,
}: SubmissionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getRankIcon = (r: number) => {
    switch (r) {
      case 1:
        return <Crown className="h-5 w-5 text-amber-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{r}</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 20) return "text-green-500";
    if (score >= 15) return "text-yellow-500";
    if (score >= 10) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <Card
      className={`transition-all ${
        isOwn ? "border-primary/50 bg-primary/5" : ""
      } ${rank && rank <= 3 ? "border-amber-500/30" : ""}`}
    >
      <CardContent className="pt-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {rank && (
              <div className="flex items-center justify-center w-8 h-8">
                {getRankIcon(rank)}
              </div>
            )}
            <Avatar className="h-10 w-10">
              <AvatarImage src={submission.profiles?.avatar_url} />
              <AvatarFallback>
                {(submission.profiles?.display_name || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {submission.profiles?.display_name || "Anonymous"}
                {isOwn && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    You
                  </Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(submission.submitted_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          {showScores && submission.ai_score !== null && (
            <div className="text-right">
              <p className="text-2xl font-bold">{submission.ai_score}</p>
              <p className="text-xs text-muted-foreground">/ 100</p>
            </div>
          )}
        </div>

        {/* Main Insight Preview */}
        <p className={`text-sm ${expanded ? "" : "line-clamp-3"}`}>
          {submission.main_insight}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {submission.scripture_connections?.slice(0, 3).map((ref, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              <BookOpen className="h-2 w-2 mr-1" />
              {ref}
            </Badge>
          ))}
          {submission.pt_principles_applied?.slice(0, 2).map((p, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              <Sparkles className="h-2 w-2 mr-1" />
              {p}
            </Badge>
          ))}
          {(submission.scripture_connections?.length > 3 ||
            submission.pt_principles_applied?.length > 2) && (
            <Badge variant="outline" className="text-xs">
              +more
            </Badge>
          )}
        </div>

        {/* Expand/Collapse */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </Button>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-4 border-t mt-4"
            >
              {/* Full Insight */}
              {submission.main_insight.length > 200 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">Full Insight</h4>
                  <p className="text-sm text-muted-foreground">
                    {submission.main_insight}
                  </p>
                </div>
              )}

              {/* Practical Application */}
              {submission.practical_application && (
                <div>
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Practical Application
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {submission.practical_application}
                  </p>
                </div>
              )}

              {/* Supporting Evidence */}
              {submission.supporting_evidence && (
                <div>
                  <h4 className="text-sm font-semibold mb-1 flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Supporting Evidence
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {submission.supporting_evidence}
                  </p>
                </div>
              )}

              {/* All Scripture Connections */}
              {submission.scripture_connections?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">All Scripture Connections</h4>
                  <div className="flex flex-wrap gap-1">
                    {submission.scripture_connections.map((ref, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* All PT Principles */}
              {submission.pt_principles_applied?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">PT Principles Applied</h4>
                  <div className="flex flex-wrap gap-1">
                    {submission.pt_principles_applied.map((p, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Score Breakdown (if judged) */}
              {showScores && submission.ai_score !== null && (
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <h4 className="text-sm font-semibold">Jeeves' Evaluation</h4>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Depth</span>
                        <span className={getScoreColor(submission.depth_score || 0)}>
                          {submission.depth_score}/25
                        </span>
                      </div>
                      <Progress value={((submission.depth_score || 0) / 25) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Biblical Accuracy</span>
                        <span className={getScoreColor(submission.biblical_score || 0)}>
                          {submission.biblical_score}/25
                        </span>
                      </div>
                      <Progress value={((submission.biblical_score || 0) / 25) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>PT Principles</span>
                        <span className={getScoreColor(submission.pt_score || 0)}>
                          {submission.pt_score}/25
                        </span>
                      </div>
                      <Progress value={((submission.pt_score || 0) / 25) * 100} />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Clarity</span>
                        <span className={getScoreColor(submission.clarity_score || 0)}>
                          {submission.clarity_score}/25
                        </span>
                      </div>
                      <Progress value={((submission.clarity_score || 0) / 25) * 100} />
                    </div>
                  </div>

                  {/* AI Feedback */}
                  {submission.ai_feedback && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-1 mb-1">
                        <MessageSquare className="h-3 w-3" />
                        <span className="text-xs font-medium">Jeeves' Feedback</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic">
                        "{submission.ai_feedback}"
                      </p>
                    </div>
                  )}

                  {/* Highlight Quotes */}
                  {submission.highlight_quotes?.length > 0 && (
                    <div className="pt-3 border-t">
                      <span className="text-xs font-medium">Notable Quotes:</span>
                      {submission.highlight_quotes.map((quote, i) => (
                        <p key={i} className="text-xs text-muted-foreground mt-1 pl-2 border-l-2 border-primary/30">
                          "{quote}"
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
