import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format, startOfWeek, endOfWeek, isToday, parseISO } from "date-fns";
import {
  BookOpen, Plus, Calendar, ChevronLeft, ChevronRight,
  Loader2, Save, Trash2, Edit2, X, BookMarked
} from "lucide-react";

interface DiaryEntry {
  id: string;
  entry_date: string;
  title: string;
  scripture_reference: string | null;
  reflection: string;
  prayer_points: string[] | null;
  gratitude_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface PersonalDevotionalDiaryProps {
  compact?: boolean;
}

export function PersonalDevotionalDiary({ compact = false }: PersonalDevotionalDiaryProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentEntry, setCurrentEntry] = useState<DiaryEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    scripture_reference: "",
    reflection: "",
    prayer_points: "",
    gratitude_notes: ""
  });

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user, selectedDate]);

  const fetchEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const weekStart = format(startOfWeek(selectedDate), 'yyyy-MM-dd');
      const weekEnd = format(endOfWeek(selectedDate), 'yyyy-MM-dd');

      const { data, error } = await (supabase
        .from('personal_devotional_diary' as any)
        .select('*')
        .eq('user_id', user.id)
        .gte('entry_date', weekStart)
        .lte('entry_date', weekEnd)
        .order('entry_date', { ascending: false }) as any);

      if (error) throw error;
      setEntries((data || []) as DiaryEntry[]);

      // Check for today's entry
      const todayEntry = ((data || []) as DiaryEntry[]).find(e => 
        e.entry_date === format(new Date(), 'yyyy-MM-dd')
      );
      setCurrentEntry(todayEntry || null);
      
      if (todayEntry) {
        setFormData({
          title: todayEntry.title,
          scripture_reference: todayEntry.scripture_reference || "",
          reflection: todayEntry.reflection,
          prayer_points: todayEntry.prayer_points?.join("\n") || "",
          gratitude_notes: todayEntry.gratitude_notes || ""
        });
      }
    } catch (error) {
      console.error('Error fetching diary entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !formData.reflection.trim()) {
      toast.error("Please add your reflection");
      return;
    }

    setSaving(true);
    try {
      const entryData = {
        user_id: user.id,
        entry_date: format(new Date(), 'yyyy-MM-dd'),
        title: formData.title || `Devotional - ${format(new Date(), 'MMM d, yyyy')}`,
        scripture_reference: formData.scripture_reference || null,
        reflection: formData.reflection,
        prayer_points: formData.prayer_points ? formData.prayer_points.split("\n").filter(p => p.trim()) : null,
        gratitude_notes: formData.gratitude_notes || null,
        updated_at: new Date().toISOString()
      };

      if (currentEntry) {
        const { error } = await (supabase
          .from('personal_devotional_diary' as any)
          .update(entryData)
          .eq('id', currentEntry.id) as any);
        if (error) throw error;
        toast.success("Diary entry updated");
      } else {
        const { error } = await (supabase
          .from('personal_devotional_diary' as any)
          .insert(entryData) as any);
        if (error) throw error;
        toast.success("Diary entry saved");
      }

      setIsEditing(false);
      setShowForm(false);
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error("Failed to save entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this diary entry?")) return;
    
    try {
      const { error } = await (supabase
        .from('personal_devotional_diary' as any)
        .delete()
        .eq('id', id) as any);
      if (error) throw error;
      toast.success("Entry deleted");
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast.error("Failed to delete entry");
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const days = direction === 'prev' ? -7 : 7;
    setSelectedDate(prev => new Date(prev.getTime() + days * 24 * 60 * 60 * 1000));
  };

  const startNewEntry = () => {
    setFormData({
      title: "",
      scripture_reference: "",
      reflection: "",
      prayer_points: "",
      gratitude_notes: ""
    });
    setShowForm(true);
    setIsEditing(true);
  };

  const selectEntry = (entry: DiaryEntry) => {
    setCurrentEntry(entry);
    setFormData({
      title: entry.title,
      scripture_reference: entry.scripture_reference || "",
      reflection: entry.reflection,
      prayer_points: entry.prayer_points?.join("\n") || "",
      gratitude_notes: entry.gratitude_notes || ""
    });
    setShowForm(true);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Card variant="glass">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  // Compact view for dashboard
  if (compact) {
    const todayEntry = entries.find(e => e.entry_date === format(new Date(), 'yyyy-MM-dd'));
    
    return (
      <Card variant="glass" className="border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">My Devotional Diary</CardTitle>
            </div>
            <Button size="sm" variant="ghost" onClick={() => navigate('/living-manna?tab=diary')}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {todayEntry ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">Today</Badge>
                <Button size="sm" variant="ghost" onClick={() => navigate('/living-manna?tab=diary')}>
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="font-medium text-sm">{todayEntry.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {todayEntry.reflection}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-3">
                Start your devotional diary today
              </p>
              <Button size="sm" onClick={() => navigate('/living-manna?tab=diary')}>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookMarked className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>My Devotional Diary</CardTitle>
                <CardDescription>
                  Your personal space for spiritual reflection
                </CardDescription>
              </div>
            </div>
            <Button onClick={startNewEntry} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Week Navigation */}
      <Card variant="glass">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 text-sm sm:text-base">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">
                {format(startOfWeek(selectedDate), 'MMM d')} - {format(endOfWeek(selectedDate), 'MMM d, yyyy')}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Entries List */}
        <Card variant="glass" className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Week's Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] lg:h-[400px]">
              {entries.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No entries this week</p>
                  <Button variant="link" size="sm" onClick={startNewEntry}>
                    Start writing
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => selectEntry(entry)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        currentEntry?.id === entry.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {isToday(parseISO(entry.entry_date)) && (
                              <Badge variant="secondary" className="text-xs">Today</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {format(parseISO(entry.entry_date), 'EEE, MMM d')}
                            </span>
                          </div>
                          <p className="font-medium text-sm truncate">{entry.title}</p>
                          {entry.scripture_reference && (
                            <p className="text-xs text-primary mt-1">{entry.scripture_reference}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Entry Form/View */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {showForm ? (isEditing ? "Write Your Reflection" : "View Entry") : "Select an Entry"}
              </CardTitle>
              {showForm && (
                <div className="flex items-center gap-2">
                  {!isEditing && currentEntry && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-destructive"
                        onClick={() => handleDelete(currentEntry.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {isEditing && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        setIsEditing(false);
                        if (!currentEntry) setShowForm(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!showForm ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-4">
                  Select an entry to view or start a new reflection
                </p>
                <Button onClick={startNewEntry}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Entry
                </Button>
              </div>
            ) : (
              <ScrollArea className="h-[300px] lg:h-[400px] pr-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Title</label>
                    <Input
                      placeholder="Give your reflection a title..."
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Scripture Reference</label>
                    <Input
                      placeholder="e.g., John 3:16, Psalm 23"
                      value={formData.scripture_reference}
                      onChange={(e) => setFormData(prev => ({ ...prev, scripture_reference: e.target.value }))}
                      disabled={!isEditing}
                      className="bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Reflection *</label>
                    <Textarea
                      placeholder="What is God speaking to you today? What insights did you receive?"
                      value={formData.reflection}
                      onChange={(e) => setFormData(prev => ({ ...prev, reflection: e.target.value }))}
                      disabled={!isEditing}
                      className="min-h-[100px] lg:min-h-[120px] bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Prayer Points</label>
                    <Textarea
                      placeholder="List your prayer points (one per line)..."
                      value={formData.prayer_points}
                      onChange={(e) => setFormData(prev => ({ ...prev, prayer_points: e.target.value }))}
                      disabled={!isEditing}
                      className="min-h-[60px] lg:min-h-[80px] bg-background/50"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Gratitude Notes</label>
                    <Textarea
                      placeholder="What are you thankful for today?"
                      value={formData.gratitude_notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, gratitude_notes: e.target.value }))}
                      disabled={!isEditing}
                      className="min-h-[50px] lg:min-h-[60px] bg-background/50"
                    />
                  </div>

                  {isEditing && (
                    <Button onClick={handleSave} disabled={saving} className="w-full">
                      {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Entry
                    </Button>
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
