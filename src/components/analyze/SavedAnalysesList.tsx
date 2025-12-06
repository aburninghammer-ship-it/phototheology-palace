import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  History, Trash2, Clock, Target, Loader2, Search, 
  ChevronDown, ChevronUp, Eye, BookOpen, Sparkles
} from "lucide-react";
import { SavedAnalysis } from "@/hooks/useThoughtAnalysisHistory";
import { formatDistanceToNow } from "date-fns";

interface SavedAnalysesListProps {
  history: SavedAnalysis[];
  isLoading: boolean;
  onSelect: (analysis: SavedAnalysis) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export const SavedAnalysesList = ({
  history,
  isLoading,
  onSelect,
  onDelete,
  selectedId,
}: SavedAnalysesListProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter(item =>
    item.input_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number | null) => {
    if (!score) return "bg-muted text-muted-foreground";
    if (score >= 80) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (score >= 60) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (score >= 40) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const getScoreLabel = (score: number | null) => {
    if (!score) return "Unscored";
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Developing";
    return "Needs Work";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="bg-card/80 backdrop-blur-sm border-purple-500/20 shadow-xl shadow-purple-500/5 overflow-hidden">
        <CardHeader 
          className="border-b border-border/50 cursor-pointer hover:bg-purple-500/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <History className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <span className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                  My Saved Analyses
                </span>
                <p className="text-xs text-muted-foreground font-normal mt-0.5">
                  Your thought analyses are automatically saved here
                </p>
              </div>
            </CardTitle>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                {history.length} saved
              </Badge>
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-4">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your analyses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>

                {/* List */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                  </div>
                ) : filteredHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 rounded-full bg-purple-500/10 mb-4">
                      <Sparkles className="h-8 w-8 text-purple-400/50" />
                    </div>
                    <p className="text-muted-foreground">
                      {searchQuery ? "No matching analyses found" : "No saved analyses yet"}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {searchQuery 
                        ? "Try a different search term" 
                        : "Submit your first thought above to get started"}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="max-h-[400px]">
                    <div className="space-y-3 pr-2">
                      {filteredHistory.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className={`group relative p-4 rounded-xl border transition-all cursor-pointer ${
                            selectedId === item.id
                              ? "bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/10"
                              : "bg-background/40 border-border/50 hover:bg-purple-500/10 hover:border-purple-500/30"
                          }`}
                          onClick={() => onSelect(item)}
                        >
                          <div className="flex items-start gap-4">
                            {/* Score Circle */}
                            <div className={`shrink-0 w-14 h-14 rounded-full flex flex-col items-center justify-center ${getScoreColor(item.overall_score)}`}>
                              <span className="text-lg font-bold">{item.overall_score || "—"}</span>
                              <span className="text-[10px] opacity-70">pts</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm line-clamp-2 mb-2">
                                {item.input_text}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                </span>
                                <Badge variant="outline" className={`text-[10px] ${getScoreColor(item.overall_score)}`}>
                                  {getScoreLabel(item.overall_score)}
                                </Badge>
                                {item.palace_rooms && item.palace_rooms.length > 0 && (
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" />
                                    {item.palace_rooms.length} rooms
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelect(item);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(item.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Summary Preview */}
                          {item.summary && (
                            <p className="text-xs text-muted-foreground/70 mt-3 line-clamp-1 pl-[4.5rem]">
                              {item.summary}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};
