import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format, isToday, isTomorrow, isThisWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Video,
  Users,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  HelpCircle,
  Loader2,
  ExternalLink,
  MessageSquare,
  Share2,
  Heart,
  UserPlus,
  Bell,
  Filter,
} from "lucide-react";

interface ChurchEventsProps {
  churchId: string;
  isLeader?: boolean;
}

interface ChurchEvent {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  location_type: "in_person" | "online" | "hybrid";
  online_url: string | null;
  start_time: string;
  end_time: string | null;
  all_day: boolean;
  category: string;
  visibility: string;
  featured: boolean;
  rsvp_enabled: boolean;
  rsvp_limit: number | null;
  cover_image_url: string | null;
  status: string;
  created_by: string;
  // Computed
  rsvp_counts?: {
    going: number;
    maybe: number;
    not_going: number;
    total_guests: number;
  };
  user_rsvp?: {
    status: string;
    guest_count: number;
  } | null;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  general: { label: "General", color: "bg-slate-500", icon: "📅" },
  worship: { label: "Worship", color: "bg-purple-500", icon: "🎵" },
  bible_study: { label: "Bible Study", color: "bg-blue-500", icon: "📖" },
  prayer: { label: "Prayer", color: "bg-rose-500", icon: "🙏" },
  outreach: { label: "Outreach", color: "bg-green-500", icon: "🌍" },
  fellowship: { label: "Fellowship", color: "bg-amber-500", icon: "🤝" },
  youth: { label: "Youth", color: "bg-pink-500", icon: "⚡" },
  children: { label: "Children", color: "bg-cyan-500", icon: "👶" },
  mens: { label: "Men's", color: "bg-indigo-500", icon: "👔" },
  womens: { label: "Women's", color: "bg-fuchsia-500", icon: "💐" },
  small_group: { label: "Small Group", color: "bg-teal-500", icon: "👥" },
  conference: { label: "Conference", color: "bg-orange-500", icon: "🎤" },
  training: { label: "Training", color: "bg-emerald-500", icon: "📚" },
  other: { label: "Other", color: "bg-gray-500", icon: "📌" },
};

export function ChurchEvents({ churchId, isLeader = false }: ChurchEventsProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "calendar">("upcoming");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    location_type: "in_person" as "in_person" | "online" | "hybrid",
    online_url: "",
    start_date: format(new Date(), "yyyy-MM-dd"),
    start_time: "10:00",
    end_date: "",
    end_time: "",
    all_day: false,
    category: "general",
    visibility: "public",
    rsvp_enabled: true,
    rsvp_limit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [churchId]);

  const loadEvents = async () => {
    try {
      const { data, error } = await (supabase
        .from("church_events" as any)
        .select("*")
        .eq("church_id", churchId)
        .eq("status", "published")
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true }) as any);

      if (error) throw error;

      // Load RSVP counts and user's RSVP for each event
      const eventsWithRsvps = await Promise.all(
        (data || []).map(async (event: ChurchEvent) => {
          // Get RSVP counts
          const { data: rsvpData } = await (supabase
            .from("church_event_rsvps" as any)
            .select("status, guest_count")
            .eq("event_id", event.id) as any);

          const counts = {
            going: 0,
            maybe: 0,
            not_going: 0,
            total_guests: 0,
          };

          (rsvpData || []).forEach((r: any) => {
            if (r.status === "going") {
              counts.going++;
              counts.total_guests += r.guest_count || 0;
            } else if (r.status === "maybe") counts.maybe++;
            else if (r.status === "not_going") counts.not_going++;
          });

          // Get user's RSVP
          let userRsvp = null;
          if (user) {
            const { data: myRsvp } = await (supabase
              .from("church_event_rsvps" as any)
              .select("status, guest_count")
              .eq("event_id", event.id)
              .eq("user_id", user.id)
              .single() as any);
            userRsvp = myRsvp;
          }

          return {
            ...event,
            rsvp_counts: counts,
            user_rsvp: userRsvp,
          };
        })
      );

      setEvents(eventsWithRsvps);
    } catch (error) {
      console.error("Error loading events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter an event title");
      return;
    }

    setIsSubmitting(true);
    try {
      const startDateTime = formData.all_day
        ? `${formData.start_date}T00:00:00`
        : `${formData.start_date}T${formData.start_time}:00`;

      let endDateTime = null;
      if (formData.end_date && formData.end_time) {
        endDateTime = formData.all_day
          ? `${formData.end_date}T23:59:59`
          : `${formData.end_date}T${formData.end_time}:00`;
      }

      const { error } = await (supabase
        .from("church_events" as any)
        .insert({
          church_id: churchId,
          created_by: user?.id,
          title: formData.title,
          description: formData.description || null,
          location: formData.location || null,
          location_type: formData.location_type,
          online_url: formData.online_url || null,
          start_time: startDateTime,
          end_time: endDateTime,
          all_day: formData.all_day,
          category: formData.category,
          visibility: formData.visibility,
          rsvp_enabled: formData.rsvp_enabled,
          rsvp_limit: formData.rsvp_limit ? parseInt(formData.rsvp_limit) : null,
          status: "published",
        }) as any);

      if (error) throw error;

      toast.success("Event created!");
      setIsCreateOpen(false);
      resetForm();
      loadEvents();
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRsvp = async (eventId: string, status: "going" | "maybe" | "not_going") => {
    if (!user) {
      toast.error("Please sign in to RSVP");
      return;
    }

    try {
      const { error } = await (supabase
        .from("church_event_rsvps" as any)
        .upsert({
          event_id: eventId,
          user_id: user.id,
          status,
        }, { onConflict: "event_id,user_id" }) as any);

      if (error) throw error;

      toast.success(
        status === "going" ? "You're going!" :
        status === "maybe" ? "Marked as maybe" :
        "Response recorded"
      );
      loadEvents();
    } catch (error) {
      console.error("Error RSVPing:", error);
      toast.error("Failed to RSVP");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      location_type: "in_person",
      online_url: "",
      start_date: format(new Date(), "yyyy-MM-dd"),
      start_time: "10:00",
      end_date: "",
      end_time: "",
      all_day: false,
      category: "general",
      visibility: "public",
      rsvp_enabled: true,
      rsvp_limit: "",
    });
  };

  const getDateLabel = (date: string) => {
    const d = new Date(date);
    if (isToday(d)) return "Today";
    if (isTomorrow(d)) return "Tomorrow";
    if (isThisWeek(d)) return format(d, "EEEE");
    return format(d, "MMM d");
  };

  const filteredEvents = selectedCategory === "all"
    ? events
    : events.filter(e => e.category === selectedCategory);

  // Calendar helpers
  const monthStart = startOfMonth(calendarDate);
  const monthEnd = endOfMonth(calendarDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter(e => isSameDay(new Date(e.start_time), day));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Church Events
          </h2>
          <p className="text-muted-foreground">
            Upcoming gatherings, studies, and fellowship opportunities
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isLeader && (
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Add a new event to your church calendar
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label>Event Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Friday Night Bible Study"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <span className="flex items-center gap-2">
                              <span>{config.icon}</span>
                              {config.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date & Time */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Date & Time</Label>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={formData.all_day}
                          onCheckedChange={(v) => setFormData({ ...formData, all_day: v })}
                        />
                        <span className="text-sm text-muted-foreground">All day</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      />
                      {!formData.all_day && (
                        <Input
                          type="time"
                          value={formData.start_time}
                          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        />
                      )}
                    </div>
                  </div>

                  {/* Location Type */}
                  <div className="space-y-2">
                    <Label>Location Type</Label>
                    <Select value={formData.location_type} onValueChange={(v: any) => setFormData({ ...formData, location_type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in_person">
                          <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            In Person
                          </span>
                        </SelectItem>
                        <SelectItem value="online">
                          <span className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Online
                          </span>
                        </SelectItem>
                        <SelectItem value="hybrid">
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Hybrid
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location / URL */}
                  {(formData.location_type === "in_person" || formData.location_type === "hybrid") && (
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Main Sanctuary"
                      />
                    </div>
                  )}

                  {(formData.location_type === "online" || formData.location_type === "hybrid") && (
                    <div className="space-y-2">
                      <Label>Online Link</Label>
                      <Input
                        value={formData.online_url}
                        onChange={(e) => setFormData({ ...formData, online_url: e.target.value })}
                        placeholder="https://zoom.us/..."
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What's this event about?"
                      rows={3}
                    />
                  </div>

                  {/* RSVP Settings */}
                  <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label>Enable RSVP</Label>
                      <Switch
                        checked={formData.rsvp_enabled}
                        onCheckedChange={(v) => setFormData({ ...formData, rsvp_enabled: v })}
                      />
                    </div>
                    {formData.rsvp_enabled && (
                      <div className="space-y-2">
                        <Label className="text-sm">Max Attendees (optional)</Label>
                        <Input
                          type="number"
                          value={formData.rsvp_limit}
                          onChange={(e) => setFormData({ ...formData, rsvp_limit: e.target.value })}
                          placeholder="Leave empty for unlimited"
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleCreateEvent}
                      disabled={isSubmitting || !formData.title.trim()}
                      className="flex-1"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Plus className="h-4 w-4 mr-2" />
                      )}
                      Create Event
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* View Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <CalendarDays className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    {config.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upcoming Events List */}
        <TabsContent value="upcoming" className="mt-4">
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
                <p className="text-muted-foreground">
                  {isLeader
                    ? "Create your first event to get started!"
                    : "Check back later for upcoming events."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const category = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.general;
                const totalAttending = (event.rsvp_counts?.going || 0) + (event.rsvp_counts?.total_guests || 0);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex">
                        {/* Date Column */}
                        <div className={`w-24 ${category.color} text-white p-4 flex flex-col items-center justify-center`}>
                          <span className="text-2xl font-bold">
                            {format(new Date(event.start_time), "d")}
                          </span>
                          <span className="text-sm uppercase">
                            {format(new Date(event.start_time), "MMM")}
                          </span>
                          <span className="text-xs mt-1">
                            {getDateLabel(event.start_time)}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs">
                                  {category.icon} {category.label}
                                </Badge>
                                {event.featured && (
                                  <Badge className="bg-amber-500 text-white">Featured</Badge>
                                )}
                              </div>
                              <h3 className="font-semibold text-lg">{event.title}</h3>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {event.all_day
                                    ? "All Day"
                                    : format(new Date(event.start_time), "h:mm a")}
                                </span>

                                {event.location && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {event.location}
                                  </span>
                                )}

                                {event.location_type === "online" && (
                                  <span className="flex items-center gap-1 text-blue-500">
                                    <Video className="h-4 w-4" />
                                    Online
                                  </span>
                                )}

                                {event.rsvp_enabled && (
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {totalAttending} attending
                                    {event.rsvp_limit && ` / ${event.rsvp_limit}`}
                                  </span>
                                )}
                              </div>

                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                            </div>

                            {/* RSVP Buttons */}
                            {event.rsvp_enabled && (
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  variant={event.user_rsvp?.status === "going" ? "default" : "outline"}
                                  className="gap-1"
                                  onClick={() => handleRsvp(event.id, "going")}
                                >
                                  <Check className="h-4 w-4" />
                                  Going
                                </Button>
                                <Button
                                  size="sm"
                                  variant={event.user_rsvp?.status === "maybe" ? "secondary" : "ghost"}
                                  className="gap-1"
                                  onClick={() => handleRsvp(event.id, "maybe")}
                                >
                                  <HelpCircle className="h-4 w-4" />
                                  Maybe
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCalendarDate(addDays(calendarDate, -30))}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <CardTitle>{format(calendarDate, "MMMM yyyy")}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCalendarDate(addDays(calendarDate, 30))}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                  <div key={`empty-start-${i}`} className="aspect-square" />
                ))}

                {/* Calendar Days */}
                {calendarDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isCurrentMonth = isSameMonth(day, calendarDate);
                  const isCurrentDay = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`
                        aspect-square p-1 border rounded-lg transition-colors cursor-pointer
                        ${isCurrentDay ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50"}
                        ${!isCurrentMonth ? "opacity-30" : ""}
                      `}
                    >
                      <div className="text-xs text-right">{format(day, "d")}</div>
                      <div className="mt-1 space-y-0.5">
                        {dayEvents.slice(0, 2).map((event) => {
                          const category = CATEGORY_CONFIG[event.category] || CATEGORY_CONFIG.general;
                          return (
                            <div
                              key={event.id}
                              className={`text-[10px] truncate px-1 rounded text-white ${category.color}`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 2 && (
                          <div className="text-[10px] text-muted-foreground text-center">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
