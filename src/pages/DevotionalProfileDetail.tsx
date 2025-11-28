import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Calendar, MessageSquare, Sparkles, Plus, Pin, Trash2, Clock, History as HistoryIcon, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDevotionalProfile } from "@/hooks/useDevotionalProfiles";
import { useDevotionalPlan } from "@/hooks/useDevotionals";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const NOTE_TYPES = [
  { value: "observation", label: "Observation", icon: "👁️" },
  { value: "prayer_point", label: "Prayer Point", icon: "🙏" },
  { value: "breakthrough", label: "Breakthrough", icon: "🎉" },
  { value: "answered_prayer", label: "Answered Prayer", icon: "✅" },
  { value: "concern", label: "Concern", icon: "⚠️" },
];

const STRUGGLE_LABELS: Record<string, { label: string; emoji: string }> = {
  anxiety: { label: "Anxiety", emoji: "😰" },
  depression: { label: "Depression", emoji: "😢" },
  grief: { label: "Grief", emoji: "💔" },
  addiction: { label: "Addiction", emoji: "⛓️" },
  identity: { label: "Identity", emoji: "🪞" },
  fear: { label: "Fear", emoji: "😨" },
  loneliness: { label: "Loneliness", emoji: "🏝️" },
  anger: { label: "Anger", emoji: "😤" },
  doubt: { label: "Doubt", emoji: "❓" },
  purpose: { label: "Purpose", emoji: "🧭" },
  relationships: { label: "Relationships", emoji: "💬" },
  purity: { label: "Purity", emoji: "🕊️" },
};

export default function DevotionalProfileDetail() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { profile, notes, history, insights, profileLoading, addNote } = useDevotionalProfile(profileId || "");
  const { plan, days, completedDayIds } = useDevotionalPlan(profile?.active_plan_id || "");

  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("observation");

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await addNote.mutateAsync({
      note_type: noteType,
      content: newNote.trim(),
    });
    setNewNote("");
  };

  const currentDay = days?.find((d) => !completedDayIds.has(d.id));

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <Button onClick={() => navigate("/devotionals")}>Back to Devotionals</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-600 via-pink-600 to-purple-600 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-white/80 hover:text-white hover:bg-white/10 mb-4"
            onClick={() => navigate("/devotionals")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Devotionals
          </Button>

          <div className="flex items-start gap-4">
            <div className="text-6xl">{profile.avatar_emoji}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
              <p className="text-white/70 capitalize">
                {profile.relationship} • {profile.age_group?.replace("_", " ") || "Age not specified"}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.struggles.map((struggle) => (
                  <Badge key={struggle} className="bg-white/20 text-white border-0">
                    {STRUGGLE_LABELS[struggle]?.emoji} {STRUGGLE_LABELS[struggle]?.label || struggle}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Devotional */}
        {currentDay && plan && (
          <Card className="mb-6 border-2 border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-rose-500" />
                  Today's Recommended Devotional
                </CardTitle>
                <Badge className="bg-rose-500">Day {currentDay.day_number}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg mb-1">{currentDay.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{currentDay.scripture_reference}</p>
              <p className="text-sm mb-4">{currentDay.christ_connection}</p>
              <div className="flex gap-2">
                <Button className="bg-gradient-to-r from-rose-500 to-pink-500">
                  <Send className="h-4 w-4 mr-2" />
                  Share with {profile.name}
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="devotionals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="devotionals">Devotionals</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Devotionals Tab */}
          <TabsContent value="devotionals" className="space-y-4">
            {days && days.length > 0 ? (
              <div className="space-y-3">
                {days.map((day) => {
                  const isCompleted = completedDayIds.has(day.id);
                  const isCurrent = day.id === currentDay?.id;
                  return (
                    <Card
                      key={day.id}
                      className={cn(
                        "transition-all",
                        isCurrent && "border-rose-400 bg-rose-50/50 dark:bg-rose-950/20",
                        isCompleted && "opacity-60"
                      )}
                    >
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm",
                            isCurrent ? "bg-rose-500 text-white" : isCompleted ? "bg-green-500 text-white" : "bg-muted"
                          )}>
                            {isCompleted ? "✓" : day.day_number}
                          </div>
                          <div>
                            <h4 className="font-medium">{day.title}</h4>
                            <p className="text-sm text-muted-foreground">{day.scripture_reference}</p>
                          </div>
                        </div>
                        <Button size="sm" variant={isCurrent ? "default" : "outline"}>
                          <Send className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center">
                  <Sparkles className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-semibold mb-2">No Active Plan</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Generate a devotional plan tailored for {profile.name}.
                  </p>
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Devotional Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            {/* Add Note */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Add a Note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={noteType} onValueChange={setNoteType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder={`Write an observation, prayer point, or breakthrough about ${profile.name}...`}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim() || addNote.isPending}>
                  {addNote.isPending ? "Saving..." : "Save Note"}
                </Button>
              </CardContent>
            </Card>

            {/* Notes List */}
            {notes && notes.length > 0 ? (
              <div className="space-y-3">
                {notes.map((note) => {
                  const noteTypeInfo = NOTE_TYPES.find((t) => t.value === note.note_type);
                  return (
                    <Card key={note.id} className={cn(note.is_pinned && "border-amber-400")}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline">
                            {noteTypeInfo?.icon} {noteTypeInfo?.label}
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {note.is_pinned && <Pin className="h-3 w-3 text-amber-500" />}
                            {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                          </div>
                        </div>
                        <p className="text-sm">{note.content}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No notes yet. Add observations, prayer points, or breakthroughs above.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            {history && history.length > 0 ? (
              <div className="space-y-3">
                {history.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <Send className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">Shared via {item.shared_via}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(item.shared_at), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      {item.viewed_at && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Viewed
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <HistoryIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No sharing history yet. Share a devotional to see it here.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            {insights ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Weekly Summary
                    </CardTitle>
                    <CardDescription>
                      {format(new Date(insights.insight_period_start), "MMM d")} -{" "}
                      {format(new Date(insights.insight_period_end), "MMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{insights.weekly_summary || "No summary generated yet."}</p>
                  </CardContent>
                </Card>

                {insights.areas_needing_prayer.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Areas Needing Prayer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {insights.areas_needing_prayer.map((area, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <span className="text-rose-500">🙏</span> {area}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {insights.suggested_message && (
                  <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        Suggested Message for {profile.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm italic">"{insights.suggested_message}"</p>
                      <Button size="sm" className="mt-3" variant="outline">
                        <Send className="h-3 w-3 mr-1" />
                        Send This Message
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No insights generated yet.</p>
                  <p className="text-xs mt-1">Insights are generated weekly based on activity.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
