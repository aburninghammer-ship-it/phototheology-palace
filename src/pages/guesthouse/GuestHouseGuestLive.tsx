import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { GuestMobileView } from "@/components/guesthouse/GuestMobileView";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function GuestHouseGuestLive() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [guestId, setGuestId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string>("");
  const [eventStatus, setEventStatus] = useState<string>("loading");
  const [eventTitle, setEventTitle] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      navigate("/guesthouse");
      return;
    }

    // Check for stored guest ID
    const storedGuestId = localStorage.getItem(`guesthouse_guest_${eventId}`);
    if (!storedGuestId) {
      // Redirect to registration/lobby
      navigate(`/guesthouse/lobby/${eventId}`);
      return;
    }

    setGuestId(storedGuestId);
    
    let channel: ReturnType<typeof supabase.channel> | null = null;
    
    const init = async () => {
      try {
        // Fetch guest info
        const { data: guest, error: guestError } = await supabase
          .from("guesthouse_guests")
          .select("display_name")
          .eq("id", storedGuestId)
          .single();

        if (guestError || !guest) {
          // Guest not found, clear storage and redirect
          localStorage.removeItem(`guesthouse_guest_${eventId}`);
          navigate(`/guesthouse/lobby/${eventId}`);
          return;
        }

        setGuestName(guest.display_name);

        // Fetch event info
        const { data: event, error: eventError } = await supabase
          .from("guesthouse_events")
          .select("title, status")
          .eq("id", eventId)
          .single();

        if (eventError || !event) {
          setEventStatus("not_found");
          setLoading(false);
          return;
        }

        setEventTitle(event.title);
        setEventStatus(event.status);

        // Subscribe to event status changes
        channel = supabase
          .channel(`event-status-${eventId}`)
          .on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'guesthouse_events', filter: `id=eq.${eventId}` },
            (payload) => {
              setEventStatus((payload.new as any).status);
            }
          )
          .subscribe();

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setEventStatus("error");
        setLoading(false);
      }
    };
    
    init();
    
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [eventId, navigate]);

  // Initialization logic moved to useEffect for proper cleanup

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Joining session...</p>
        </div>
      </div>
    );
  }

  if (eventStatus === "not_found") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This event may have been removed or the link is invalid.
          </p>
          <Button onClick={() => navigate("/guesthouse")}>
            Back to GuestHouse
          </Button>
        </Card>
      </div>
    );
  }

  if (eventStatus === "completed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-3xl">🎉</span>
          </motion.div>
          <h2 className="text-xl font-bold mb-2">Session Complete!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for participating in {eventTitle}
          </p>
          <Button onClick={() => navigate(`/guesthouse/assembly/${eventId}`)}>
            View Results
          </Button>
        </Card>
      </div>
    );
  }

  if (eventStatus === "scheduled") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-3xl">⏳</span>
          </motion.div>
          <h2 className="text-xl font-bold mb-2">Waiting for Host</h2>
          <p className="text-muted-foreground mb-4">
            {eventTitle} hasn't started yet
          </p>
          <p className="text-sm text-muted-foreground">
            Stay on this page - you'll join automatically when the host starts
          </p>
        </Card>
      </div>
    );
  }

  if (!guestId || !guestName) {
    return null;
  }

  return (
    <GuestMobileView
      eventId={eventId!}
      guestId={guestId}
      guestName={guestName}
    />
  );
}
