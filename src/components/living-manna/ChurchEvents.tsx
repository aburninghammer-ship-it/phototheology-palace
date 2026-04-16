import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Plus, Check, Clock, CalendarDays } from "lucide-react";
import { format, parseISO, isFuture, isPast } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ChurchEventsProps {
  churchId: string;
}

interface ChurchEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  category: string;
  max_attendees: number | null;
  created_by: string | null;
  created_at: string;
}

interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  status: string;
  guest_count: number;
  notes: string | null;
}

const EVENT_CATEGORIES = [
  { value: "worship", label: "Worship Service", color: "bg-primary" },
  { value: "bible_study", label: "Bible Study", color: "bg-blue-500" },
  { value: "prayer", label: "Prayer Meeting", color: "bg-purple-500" },
  { value: "fellowship", label: "Fellowship", color: "bg-green-500" },
  { value: "outreach", label: "Outreach", color: "bg-orange-500" },
  { value: "youth", label: "Youth Event", color: "bg-pink-500" },
  { value: "general", label: "General", color: "bg-muted" },
];

export function ChurchEvents({ churchId }: ChurchEventsProps) {
  const { user } = useAuth();
  const { role } = useChurchMembership();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const canManageEvents = role === "admin" || role === "leader";

  // Fetch events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["church-events", churchId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("church_events")
        .select("*")
        .eq("church_id", churchId)
        .order("event_date", { ascending: true });

      if (error) throw error;
      return data as ChurchEvent[];
    },
    enabled: !!churchId,
  });

  // Fetch user's RSVPs
  const { data: userRsvps = [] } = useQuery({
    queryKey: ["user-rsvps", churchId, user?.id],
    queryFn: async () => {
      if (!user) return [];
      const eventIds = events.map(e => e.id);
      if (eventIds.length === 0) return [];

      const { data, error } = await (supabase as any)
        .from("church_event_rsvps")
        .select("*")
        .eq("user_id", user.id)
        .in("event_id", eventIds);

      if (error) throw error;
      return data as EventRSVP[];
    },
    enabled: !!user && events.length > 0,
  });

  // Create event mutation
  const createEvent = useMutation({
    mutationFn: async (eventData: {
      title: string;
      description: string;
      event_date: string;
      end_date?: string;
      location: string;
      category: string;
      max_attendees?: number;
    }) => {
      const { data, error } = await (supabase as any)
        .from("church_events")
        .insert({
          ...eventData,
          church_id: churchId,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ["church-events", churchId] });
      setIsCreateOpen(false);
      toast({ title: "Event created", description: "Your event has been scheduled." });

      // Send email notifications to church members (fire-and-forget)
      if (newEvent?.id) {
        supabase.functions.invoke('send-church-notification-email', {
          body: {
            churchId,
            notificationType: 'event',
            referenceId: newEvent.id,
            title: newEvent.title,
            message: newEvent.description || 'A new event has been scheduled.',
            eventDate: newEvent.event_date,
            eventLocation: newEvent.location,
          }
        }).then(res => {
          if (res.data?.sent > 0) {
            toast({ title: "Emails sent", description: `Notified ${res.data.sent} members by email.` });
          }
        }).catch(err => console.error('Email notification error:', err));
      }
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to create event.", variant: "destructive" });
      console.error(error);
    },
  });

  // RSVP mutation
  const rsvpToEvent = useMutation({
    mutationFn: async ({ eventId, status, guestCount = 0 }: { eventId: string; status: string; guestCount?: number }) => {
      const { data, error } = await (supabase as any)
        .from("church_event_rsvps")
        .upsert({
          event_id: eventId,
          user_id: user?.id,
          status,
          guest_count: guestCount,
        }, { onConflict: "event_id,user_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-rsvps", churchId, user?.id] });
      toast({ title: "RSVP updated", description: "Your response has been recorded." });
    },
  });

  const handleCreateEvent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createEvent.mutate({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      event_date: formData.get("event_date") as string,
      end_date: formData.get("end_date") as string || undefined,
      location: formData.get("location") as string,
      category: formData.get("category") as string,
      max_attendees: formData.get("max_attendees") ? parseInt(formData.get("max_attendees") as string) : undefined,
    });
  };

  const getUserRsvp = (eventId: string) => userRsvps.find(r => r.event_id === eventId);

  const getCategoryInfo = (category: string) => 
    EVENT_CATEGORIES.find(c => c.value === category) || EVENT_CATEGORIES[6];

  const filteredEvents = selectedCategory 
    ? events.filter(e => e.category === selectedCategory)
    : events;

  const upcomingEvents = filteredEvents.filter(e => isFuture(parseISO(e.event_date)));
  const pastEvents = filteredEvents.filter(e => isPast(parseISO(e.event_date)));

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardContent className="py-8 text-center">
          <div className="animate-pulse">Loading events...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <CardTitle>Church Events</CardTitle>
            </div>
            {canManageEvents && (
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateEvent} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Event Title</Label>
                      <Input id="title" name="title" required placeholder="e.g., Prayer Night" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" placeholder="Event details..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="event_date">Start Date & Time</Label>
                        <Input id="event_date" name="event_date" type="datetime-local" required />
                      </div>
                      <div>
                        <Label htmlFor="end_date">End Date & Time</Label>
                        <Input id="end_date" name="end_date" type="datetime-local" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" placeholder="Church sanctuary, Zoom, etc." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" defaultValue="general">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {EVENT_CATEGORIES.map(cat => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="max_attendees">Max Attendees (optional)</Label>
                        <Input id="max_attendees" name="max_attendees" type="number" min="1" />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={createEvent.isPending}>
                      {createEvent.isPending ? "Creating..." : "Create Event"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <CardDescription>Upcoming gatherings and activities</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {EVENT_CATEGORIES.map(cat => (
              <Badge
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upcoming Events</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingEvents.map(event => {
              const categoryInfo = getCategoryInfo(event.category);
              const userRsvp = getUserRsvp(event.id);

              return (
                <Card key={event.id} variant="glass" className="overflow-hidden">
                  <div className={`h-1 ${categoryInfo.color}`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {categoryInfo.label}
                        </Badge>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </div>
                      {userRsvp?.status === "attending" && (
                        <Badge variant="default" className="gap-1">
                          <Check className="h-3 w-3" />
                          Going
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {event.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>
                    )}

                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(event.event_date), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{format(parseISO(event.event_date), "h:mm a")}</span>
                        {event.end_date && (
                          <span> - {format(parseISO(event.end_date), "h:mm a")}</span>
                        )}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.max_attendees && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>Max {event.max_attendees} attendees</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      {userRsvp?.status === "attending" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rsvpToEvent.mutate({ eventId: event.id, status: "not_attending" })}
                        >
                          Cancel RSVP
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => rsvpToEvent.mutate({ eventId: event.id, status: "attending" })}
                        >
                          RSVP - I'm Going
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-muted-foreground">Past Events</h3>
          <div className="grid gap-4 md:grid-cols-2 opacity-60">
            {pastEvents.slice(0, 4).map(event => {
              const categoryInfo = getCategoryInfo(event.category);
              return (
                <Card key={event.id} variant="glass">
                  <CardHeader className="pb-2">
                    <Badge variant="secondary" className="w-fit mb-1 text-xs">
                      {categoryInfo.label}
                    </Badge>
                    <CardTitle className="text-base">{event.title}</CardTitle>
                    <CardDescription>
                      {format(parseISO(event.event_date), "MMMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <Card variant="glass">
          <CardContent className="py-12 text-center">
            <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No events scheduled yet.</p>
            {canManageEvents && (
              <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                Create First Event
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
