import { SimmerSession } from "@/hooks/useSimmerSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronRight, Flame, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface SimmerSessionListProps {
  sessions: SimmerSession[];
  loading: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  currentSessionId?: string;
}

const DAY_NAMES = [
  "Ignition",
  "Flavor Explosion", 
  "Compression",
  "Christ Overcharge",
  "Weaponization",
  "Seasoning"
];

export function SimmerSessionList({ 
  sessions, 
  loading, 
  onSelect, 
  onDelete,
  currentSessionId 
}: SimmerSessionListProps) {
  if (loading) {
    return (
      <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Your Sermons in the Forge
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions.length === 0 ? (
          <p className="text-orange-200/60 text-center py-8">
            No sermons simmering yet. Start your first!
          </p>
        ) : (
          sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  session.id === currentSessionId
                    ? "bg-orange-500/20 border-orange-500/50"
                    : "bg-black/20 border-orange-500/20 hover:bg-orange-500/10"
                }`}
                onClick={() => onSelect(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">
                      {session.title || session.theme.substring(0, 50)}
                      {session.theme.length > 50 && "..."}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          session.status === "completed"
                            ? "border-green-500/50 text-green-400"
                            : "border-orange-500/50 text-orange-300"
                        }`}
                      >
                        Day {session.current_day}: {DAY_NAMES[session.current_day - 1]}
                      </Badge>
                      {session.gems && (
                        <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-300">
                          💎 {(session.gems as any[]).length} gems
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-orange-200/60 mt-2">
                      Updated {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Delete this session?")) {
                          onDelete(session.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <ChevronRight className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
