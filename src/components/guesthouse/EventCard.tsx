import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Users,
  Gamepad2,
  Video,
  ArrowRight,
  Zap
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    scheduled_at: string;
    duration_minutes: number;
    max_guests: number;
    status: string;
    session_type: string;
    youtube_url: string | null;
    game_type: string | null;
  };
  index: number;
  onJoin: () => void;
}

export function EventCard({ event, index, onJoin }: EventCardProps) {
  const isLive = event.session_type === "live_session";
  const eventDate = new Date(event.scheduled_at);
  const isToday = new Date().toDateString() === eventDate.toDateString();
  const isStartingSoon = eventDate.getTime() - Date.now() < 1000 * 60 * 30; // 30 mins

  return (
    <div>
      <Card className="group relative overflow-hidden bg-card/95 border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg active:scale-[0.98]">
        {/* Status indicator */}
        {event.status === "live" && (
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-destructive text-destructive-foreground animate-pulse">
              <Zap className="w-3 h-3 mr-1" /> LIVE NOW
            </Badge>
          </div>
        )}
        
        {/* Event type badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant={isLive ? "secondary" : "default"} className="flex items-center gap-1">
            {isLive ? (
              <>
                <Video className="w-3 h-3" /> Live Session
              </>
            ) : (
              <>
                <Gamepad2 className="w-3 h-3" /> Game Night
              </>
            )}
          </Badge>
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="p-6 pt-14">
          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          
          {event.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {event.description}
            </p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                {isToday ? (
                  <span className="text-primary font-medium">Today</span>
                ) : (
                  format(eventDate, "EEEE, MMM d")
                )}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-secondary" />
              <span>
                {format(eventDate, "h:mm a")} ({event.duration_minutes} min)
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-accent" />
              <span>Up to {event.max_guests} guests</span>
            </div>
          </div>

          {/* Time until event */}
          <div className="mb-4">
            {isStartingSoon && event.status !== "live" ? (
              <Badge variant="outline" className="border-accent text-accent">
                Starts {formatDistanceToNow(eventDate, { addSuffix: true })}
              </Badge>
            ) : event.status !== "live" && (
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(eventDate, { addSuffix: true })}
              </span>
            )}
          </div>

          <Button 
            onClick={onJoin} 
            className="w-full group/btn"
            variant={event.status === "live" ? "default" : "outline"}
          >
            {event.status === "live" ? "Join Now" : "Register"}
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
