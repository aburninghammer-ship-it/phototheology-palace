import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { 
  Users, 
  Clock, 
  ArrowLeft,
  Sparkles,
  Zap
} from "lucide-react";
import { GroupReveal } from "@/components/guesthouse/GroupReveal";
import { PresenceIndicators } from "@/components/guesthouse/PresenceIndicators";
import { GuestReactions } from "@/components/guesthouse/GuestReactions";
import { toast } from "sonner";

const GROUPS = [
  { name: "seekers", color: "#3B82F6", emoji: "🔍" },
  { name: "watchers", color: "#10B981", emoji: "👁️" },
  { name: "scribes", color: "#F59E0B", emoji: "📜" },
  { name: "pathfinders", color: "#8B5CF6", emoji: "🧭" }
];

interface GuestHouseEvent {
  id: string;
  title: string;
  status: string;
  scheduled_at: string;
  session_type: string;
}

export default function GuestHouseLobby() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<GuestHouseEvent | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [assignedGroup, setAssignedGroup] = useState<typeof GROUPS[0] | null>(null);
  const [showGroupReveal, setShowGroupReveal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [guestCount, setGuestCount] = useState(0);

  useEffect(() => {
    if (!eventId) {
      navigate("/guesthouse");
      return;
    }
    
    const storedGuestId = localStorage.getItem(`guesthouse_guest_${eventId}`);
    if (!storedGuestId) {
      toast.error("Please register first");
      navigate(`/guesthouse/event/${eventId}`);
      return;
    }
    setGuestId(storedGuestId);
    fetchEventAndGuest(storedGuestId);
    
    // Subscribe and get cleanup function
    const channel = supabase
      .channel(`lobby:${eventId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guesthouse_guests", filter: `event_id=eq.${eventId}` },
        () => fetchGuestCount()
      )
      .subscribe();

    fetchGuestCount();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId, navigate]);

  useEffect(() => {
    if (!event) return;
    
    const timer = setInterval(() => {
      const eventDate = new Date(event.scheduled_at);
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown("Starting now!");
        // Check if event is live, then navigate
        if (event.status === "live") {
          navigate(`/guesthouse/play/${eventId}`);
        }
        return;
      }
      
      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [event, eventId, navigate]);

  const fetchEventAndGuest = async (gId: string) => {
    try {
      const [eventRes, guestRes] = await Promise.all([
        supabase
          .from("guesthouse_events")
          .select("*")
          .eq("id", eventId)
          .single(),
        supabase
          .from("guesthouse_guests")
          .select("*")
          .eq("id", gId)
          .single()
      ]);

      if (eventRes.error) throw eventRes.error;
      setEvent(eventRes.data as GuestHouseEvent);

      if (guestRes.data) {
        setGuestName(guestRes.data.display_name);
        if (guestRes.data.group_name) {
          const group = GROUPS.find(g => g.name === guestRes.data.group_name);
          if (group) {
            setAssignedGroup(group);
            setIsCheckedIn(true);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      navigate("/guesthouse");
    }
  };

  // subscribeToGuests moved inline to useEffect for proper cleanup

  const fetchGuestCount = async () => {
    const { count } = await supabase
      .from("guesthouse_guests")
      .select("*", { count: "exact", head: true })
      .eq("event_id", eventId)
      .eq("is_checked_in", true);
    
    setGuestCount(count || 0);
  };

  const handleCheckIn = async () => {
    if (!guestId) return;

    // Assign random group
    const randomGroup = GROUPS[Math.floor(Math.random() * GROUPS.length)];

    try {
      const { error } = await supabase
        .from("guesthouse_guests")
        .update({
          is_checked_in: true,
          checked_in_at: new Date().toISOString(),
          group_name: randomGroup.name,
          group_color: randomGroup.color
        })
        .eq("id", guestId);

      if (error) throw error;

      setShowGroupReveal(true);
      setTimeout(() => {
        setAssignedGroup(randomGroup);
        setIsCheckedIn(true);
        setShowGroupReveal(false);
      }, 3000);
    } catch (error) {
      console.error("Check-in error:", error);
      toast.error("Failed to check in");
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading lobby...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Lobby | {event.title}</title>
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/guesthouse/event/${eventId}`)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          {/* Group Reveal Animation */}
          <AnimatePresence>
            {showGroupReveal && (
              <GroupReveal onComplete={() => setShowGroupReveal(false)} />
            )}
          </AnimatePresence>

          {/* Main Lobby Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 bg-card/80 backdrop-blur-xl border-primary/20 text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
              <p className="text-muted-foreground mb-6">Waiting Room</p>

              {/* Countdown */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">{countdown}</span>
                </div>
              </div>

              {/* Check-in / Group Display */}
              {!isCheckedIn ? (
                <div>
                  <p className="text-muted-foreground mb-4">
                    Welcome, <strong>{guestName}</strong>! Ready to find your team?
                  </p>
                  <Button size="lg" onClick={handleCheckIn}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Check In & Join a Team
                  </Button>
                </div>
              ) : assignedGroup && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="space-y-4"
                >
                  <div 
                    className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border-2"
                    style={{ 
                      borderColor: assignedGroup.color,
                      backgroundColor: `${assignedGroup.color}10`
                    }}
                  >
                    <span className="text-4xl">{assignedGroup.emoji}</span>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Your Team</p>
                      <p 
                        className="text-2xl font-bold capitalize"
                        style={{ color: assignedGroup.color }}
                      >
                        {assignedGroup.name}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Stay here. The game will start automatically.
                  </p>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Presence & Reactions */}
          {guestId && (
            <>
              <PresenceIndicators eventId={eventId!} guestCount={guestCount} />
              <GuestReactions eventId={eventId!} guestId={guestId} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
