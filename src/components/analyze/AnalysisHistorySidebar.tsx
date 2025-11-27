import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  History, ChevronRight, ChevronLeft, Trash2, Clock, 
  Target, Loader2, Search
} from "lucide-react";
import { SavedAnalysis } from "@/hooks/useThoughtAnalysisHistory";
import { formatDistanceToNow } from "date-fns";
import { Input } from "@/components/ui/input";

interface AnalysisHistorySidebarProps {
  history: SavedAnalysis[];
  isLoading: boolean;
  onSelect: (analysis: SavedAnalysis) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
}

export const AnalysisHistorySidebar = ({
  history,
  isLoading,
  onSelect,
  onDelete,
  selectedId,
}: AnalysisHistorySidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter(item =>
    item.input_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getScoreColor = (score: number | null) => {
    if (!score) return "bg-muted text-muted-foreground";
    if (score >= 80) return "bg-emerald-500/20 text-emerald-400";
    if (score >= 60) return "bg-amber-500/20 text-amber-400";
    if (score >= 40) return "bg-orange-500/20 text-orange-400";
    return "bg-red-500/20 text-red-400";
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-purple-600/90 hover:bg-purple-500 text-white p-2 rounded-r-lg shadow-lg backdrop-blur-sm transition-colors"
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: 0 }} animate={{ rotate: 0 }}>
              <ChevronLeft className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div key="open" className="flex items-center gap-1">
              <History className="h-5 w-5" />
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-card/95 backdrop-blur-xl border-r border-purple-500/20 z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <History className="h-5 w-5 text-purple-400" />
                      Analysis History
                    </h2>
                    <Badge variant="secondary" className="bg-purple-500/20">
                      {history.length}
                    </Badge>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search analyses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-background/50 border-purple-500/20"
                    />
                  </div>
                </div>

                {/* History List */}
                <ScrollArea className="flex-1">
                  <div className="p-3 space-y-2">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
                      </div>
                    ) : filteredHistory.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">
                          {searchQuery ? "No matching analyses" : "No analyses yet"}
                        </p>
                        <p className="text-xs mt-1">
                          {searchQuery ? "Try a different search" : "Your saved analyses will appear here"}
                        </p>
                      </div>
                    ) : (
                      filteredHistory.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => onSelect(item)}
                          className={`p-3 rounded-lg cursor-pointer transition-all border ${
                            selectedId === item.id
                              ? "bg-purple-500/20 border-purple-500/50"
                              : "bg-background/30 border-transparent hover:bg-purple-500/10 hover:border-purple-500/20"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-sm line-clamp-2 flex-1">
                              {item.input_text.substring(0, 100)}
                              {item.input_text.length > 100 && "..."}
                            </p>
                            <Badge className={`shrink-0 ${getScoreColor(item.overall_score)}`}>
                              <Target className="h-3 w-3 mr-1" />
                              {item.overall_score || "—"}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-3 border-t border-border/50">
                  <Button
                    variant="outline"
                    className="w-full bg-purple-500/10 border-purple-500/30"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
