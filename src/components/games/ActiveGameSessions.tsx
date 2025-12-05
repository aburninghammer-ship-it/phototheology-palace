import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Trash2, Clock } from "lucide-react";
import { useActiveGameSessions } from "@/hooks/useGameSession";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

// Game type to display info mapping
const gameTypeInfo: Record<string, { name: string; icon: string; route: string }> = {
  principle_sprint: { name: "Principle Sprint", icon: "⚡", route: "/games/principle-sprint" },
  connection_dash: { name: "Connection Dash", icon: "🔗", route: "/games/connection-dash" },
  story_room: { name: "Story Room", icon: "📚", route: "/games/story-room" },
  observation_room: { name: "Observation Detective", icon: "🔍", route: "/games/observation-room" },
  equation_builder: { name: "Equation Builder", icon: "🧮", route: "/games/equation-builder" },
  christ_lock: { name: "Christ Lock", icon: "🔐", route: "/games/christ-lock" },
  blue_room: { name: "Blue Room", icon: "💙", route: "/games/blue-room" },
  sanctuary_run: { name: "Sanctuary Run", icon: "⛪", route: "/games/sanctuary-run" },
  time_zone_invasion: { name: "Time Zone Invasion", icon: "⏰", route: "/games/time-zone-invasion" },
  concentration_room: { name: "Concentration Room", icon: "🎯", route: "/games/concentration-room" },
  dimensions_room: { name: "Dimensions Room", icon: "💠", route: "/games/dimensions-room" },
  chain_chess: { name: "Chain Chess", icon: "♟️", route: "/games/chain-chess/new" },
};

export function ActiveGameSessions() {
  const navigate = useNavigate();
  const { sessions, isLoading, refetch } = useActiveGameSessions();

  const handleAbandon = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await supabase
        .from("game_sessions")
        .update({ is_abandoned: true })
        .eq("id", sessionId);
      
      toast.success("Game session removed");
      refetch();
    } catch (error) {
      console.error("Error abandoning session:", error);
      toast.error("Failed to remove session");
    }
  };

  if (isLoading || sessions.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Play className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Continue Playing</h2>
        <Badge variant="secondary" className="ml-2">{sessions.length}</Badge>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sessions.map((session, index) => {
          const gameInfo = gameTypeInfo[session.gameType] || {
            name: session.gameType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
            icon: "🎮",
            route: "/games"
          };
          
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 border-primary/30 bg-primary/5 hover:-translate-y-1"
                onClick={() => navigate(gameInfo.route)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{gameInfo.icon}</span>
                      <div>
                        <h3 className="font-semibold">{gameInfo.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => handleAbandon(session.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex gap-4 text-sm">
                      <span>Score: <strong>{session.score}</strong></span>
                      {session.totalSteps > 0 && (
                        <span>Progress: <strong>{session.currentStep}/{session.totalSteps}</strong></span>
                      )}
                    </div>
                    <Button size="sm" className="gap-1">
                      <Play className="h-3 w-3" />
                      Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
