import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import { 
  Castle, 
  Users, 
  Calendar, 
  Clock, 
  Sparkles, 
  Play, 
  Video,
  ArrowRight,
  Star
} from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { WelcomeMessage } from "@/components/guesthouse/WelcomeMessage";
import { EventCard } from "@/components/guesthouse/EventCard";
import { SocialShareCard } from "@/components/guesthouse/SocialShareCard";

interface GuestHouseEvent {
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
}

export default function GuestHouseLanding() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<GuestHouseEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextEvent, setNextEvent] = useState<GuestHouseEvent | null>(null);
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!nextEvent) return;
    
    const timer = setInterval(() => {
      const eventDate = new Date(nextEvent.scheduled_at);
      const now = new Date();
      const diff = eventDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setCountdown("Starting now!");
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (days > 0) {
        setCountdown(`${days}d ${hours}h ${minutes}m`);
      } else {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextEvent]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("guesthouse_events")
        .select("*")
        .in("status", ["scheduled", "live"])
        .gte("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(10);

      if (error) throw error;
      
      const typedData = (data || []) as GuestHouseEvent[];
      setEvents(typedData);
      if (typedData.length > 0) {
        setNextEvent(typedData[0]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>GuestHouse | Phototheology Palace</title>
        <meta name="description" content="Join nightly Scripture adventures in the GuestHouse. No account needed. Free, fun, and deep." />
      </Helmet>

      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Static background gradient - optimized for performance */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl opacity-40" />
          <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full bg-secondary/10 blur-3xl opacity-30" />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-accent/10 blur-3xl opacity-30" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Castle className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">The GuestHouse</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Welcome to the GuestHouse
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Step into the front porch of the Phototheology Palace. 
              Free, fun, and open to all.
            </p>

            {/* Countdown to next event */}
            {nextEvent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block"
              >
                <Card className="bg-card/95 border-primary/20 p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Next Event</p>
                      <p className="text-2xl font-bold text-primary">{countdown}</p>
                    </div>
                    <Button 
                      onClick={() => navigate(`/guesthouse/event/${nextEvent.id}`)}
                      className="ml-4"
                    >
                      Join Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <WelcomeMessage />
          </motion.div>

          {/* Upcoming Events */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Upcoming Events
              </h2>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {events.reduce((acc, e) => acc + e.max_guests, 0)} spots available
              </Badge>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="h-64 animate-pulse bg-muted/50" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <Card className="p-12 text-center bg-card/95 border-border/50">
                <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Events Scheduled Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Check back soon! New GuestNight events are added regularly.
                </p>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Explore the Palace
                </Button>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    index={index}
                    onJoin={() => navigate(`/guesthouse/event/${event.id}`)}
                  />
                ))}
              </div>
            )}
          </motion.section>

          {/* How It Works */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Users, title: "Join", desc: "Enter your name. No account needed." },
                { icon: Star, title: "Team Up", desc: "Get randomly placed in one of 4 teams." },
                { icon: Play, title: "Play", desc: "Race through a Scripture-based challenge." },
                { icon: Sparkles, title: "Reveal", desc: "See how all teams' discoveries connect." }
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <Card className="p-6 text-center bg-card/95 border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Social Share */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <SocialShareCard />
          </motion.section>

          {/* CTA to explore Palace */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-16 pb-8"
          >
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
              <h3 className="text-xl font-bold mb-2">Want to Go Deeper?</h3>
              <p className="text-muted-foreground mb-4">
                The GuestHouse is just the beginning. The full Palace awaits.
              </p>
              <Button variant="outline" onClick={() => navigate("/pricing")}>
                Explore Full Access
              </Button>
            </Card>
          </motion.section>
        </div>
      </div>
    </>
  );
}
