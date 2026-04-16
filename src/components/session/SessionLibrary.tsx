import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionMode } from '@/contexts/SessionModeContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Search, 
  BookOpen, 
  Clock, 
  MoreVertical,
  Play,
  Share2,
  Trash2,
  FileText,
  Loader2,
  Filter,
  Flame,
  Feather,
  Brain,
  PenTool
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'sonner';

interface StudySession {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  status: string;
  startedAt: string;
  savedAt?: string;
  totalDurationSeconds: number;
  aiSummary?: string;
}

interface SermonWriterSession {
  id: string;
  title: string;
  theme_passage: string | null;
  status: string;
  content: string | null;
  updated_at: string;
  created_at: string;
}

interface SermonSimmerSession {
  id: string;
  theme: string;
  theme_passage: string | null;
  current_day: number;
  gems: unknown;
  updated_at: string;
  created_at: string;
}

type SessionType = 'all' | 'study' | 'sermon-writer' | 'sermon-simmer';

export function SessionLibrary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getSessions, loadSession, deleteSession, shareSession, isLoading } = useSessionMode();
  
  // Study Sessions
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  
  // Sermon Writer Sessions
  const [sermonWriterSessions, setSermonWriterSessions] = useState<SermonWriterSession[]>([]);
  
  // Sermon Simmer Sessions
  const [sermonSimmerSessions, setSermonSimmerSessions] = useState<SermonSimmerSession[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SessionType>('all');
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<{ id: string; type: SessionType } | null>(null);

  useEffect(() => {
    if (user) {
      loadAllSessions();
    }
  }, [user]);

  const loadAllSessions = async () => {
    setLoading(true);
    
    try {
      // Load all session types in parallel
      const [studyData, sermonWriterData, sermonSimmerData] = await Promise.all([
        getSessions(),
        loadSermonWriterSessions(),
        loadSermonSimmerSessions()
      ]);
      
      setStudySessions(studyData);
      setSermonWriterSessions(sermonWriterData);
      setSermonSimmerSessions(sermonSimmerData);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Failed to load some sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadSermonWriterSessions = async (): Promise<SermonWriterSession[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('sermon_writer_sessions')
        .select('id, title, theme_passage, status, content, updated_at, created_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading sermon writer sessions:', error);
      return [];
    }
  };

  const loadSermonSimmerSessions = async (): Promise<SermonSimmerSession[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('sermon_simmer_sessions')
        .select('id, theme, theme_passage, current_day, gems, updated_at, created_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading sermon simmer sessions:', error);
      return [];
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleDelete = async () => {
    if (!sessionToDelete) return;
    
    try {
      if (sessionToDelete.type === 'study') {
        await deleteSession(sessionToDelete.id);
        setStudySessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
      } else if (sessionToDelete.type === 'sermon-writer') {
        const { error } = await supabase
          .from('sermon_writer_sessions')
          .delete()
          .eq('id', sessionToDelete.id);
        if (error) throw error;
        setSermonWriterSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
      } else if (sessionToDelete.type === 'sermon-simmer') {
        const { error } = await supabase
          .from('sermon_simmer_sessions')
          .delete()
          .eq('id', sessionToDelete.id);
        if (error) throw error;
        setSermonSimmerSessions(prev => prev.filter(s => s.id !== sessionToDelete.id));
      }
      
      toast.success('Session deleted');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    } finally {
      setSessionToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleResume = async (sessionId: string, type: SessionType) => {
    if (type === 'study') {
      await loadSession(sessionId);
      navigate('/study-buddy');
    } else if (type === 'sermon-writer') {
      navigate(`/sermon-writer?session=${sessionId}`);
    } else if (type === 'sermon-simmer') {
      navigate(`/sermon-simmer?session=${sessionId}`);
    }
  };

  const filterSessions = <T extends { title?: string; theme?: string; description?: string }>(
    sessions: T[],
    query: string
  ): T[] => {
    if (!query) return sessions;
    const lowerQuery = query.toLowerCase();
    return sessions.filter(s => 
      (s.title?.toLowerCase().includes(lowerQuery)) ||
      (s.theme?.toLowerCase().includes(lowerQuery)) ||
      (s.description?.toLowerCase().includes(lowerQuery))
    );
  };

  const filteredStudySessions = filterSessions(studySessions, searchQuery);
  const filteredSermonWriterSessions = filterSessions(sermonWriterSessions, searchQuery);
  const filteredSermonSimmerSessions = filterSessions(sermonSimmerSessions, searchQuery);

  const totalCount = studySessions.length + sermonWriterSessions.length + sermonSimmerSessions.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const DAY_NAMES = [
    "Foundation",
    "Structure", 
    "Connections",
    "Refinement",
    "Polish",
    "Fire",
    "Complete"
  ];

  const renderStudySessionCard = (session: StudySession) => (
    <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleResume(session.id, 'study')}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-blue-500" />
              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/30">
                Study Buddy
              </Badge>
            </div>
            <CardTitle className="text-base truncate">{session.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              {session.savedAt 
                ? format(new Date(session.savedAt), 'MMM d, yyyy')
                : formatDistanceToNow(new Date(session.startedAt), { addSuffix: true })}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleResume(session.id, 'study')}>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => shareSession(session.id)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setSessionToDelete({ id: session.id, type: 'study' });
                  setDeleteDialogOpen(true);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {session.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {session.description}
          </p>
        )}
        
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={session.status === 'saved' ? 'default' : 'secondary'}>
            {session.status}
          </Badge>
          {session.totalDurationSeconds > 0 && (
            <span className="text-xs text-muted-foreground">
              {formatDuration(session.totalDurationSeconds)}
            </span>
          )}
        </div>

        {session.tags && session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {session.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {session.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{session.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {session.aiSummary && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <FileText className="h-3 w-3" />
              AI Summary
            </div>
            <p className="text-xs line-clamp-2">{session.aiSummary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderSermonWriterCard = (session: SermonWriterSession) => (
    <Card key={session.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Feather className="h-4 w-4 text-purple-500" />
              <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-600 border-purple-500/30">
                Sermon Writer
              </Badge>
            </div>
            <CardTitle className="text-base truncate">{session.title || 'Untitled Sermon'}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleResume(session.id, 'sermon-writer')}>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setSessionToDelete({ id: session.id, type: 'sermon-writer' });
                  setDeleteDialogOpen(true);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {session.theme_passage && (
          <p className="text-sm text-muted-foreground mb-3">
            📖 {session.theme_passage}
          </p>
        )}
        
        <div className="flex items-center gap-2">
          <Badge variant={session.status === 'complete' ? 'default' : 'secondary'}>
            {session.status || 'draft'}
          </Badge>
          {session.content && (
            <span className="text-xs text-muted-foreground">
              {session.content.length > 500 ? `${Math.floor(session.content.length / 500)}+ pages` : 'In progress'}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderSermonSimmerCard = (session: SermonSimmerSession) => (
    <Card key={session.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-4 w-4 text-orange-500" />
              <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600 border-orange-500/30">
                Sermon Simmer
              </Badge>
            </div>
            <CardTitle className="text-base truncate">{session.theme || 'Untitled Simmer'}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(session.updated_at), { addSuffix: true })}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleResume(session.id, 'sermon-simmer')}>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => {
                  setSessionToDelete({ id: session.id, type: 'sermon-simmer' });
                  setDeleteDialogOpen(true);
                }}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {session.theme_passage && (
          <p className="text-sm text-muted-foreground mb-3">
            📖 {session.theme_passage}
          </p>
        )}
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary">
            Day {session.current_day + 1}: {DAY_NAMES[session.current_day] || 'Processing'}
          </Badge>
          {session.gems && Array.isArray(session.gems) && session.gems.length > 0 && (
            <Badge variant="outline" className="text-xs">
              💎 {session.gems.length} gems
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = (type: SessionType) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {type === 'sermon-writer' ? (
          <Feather className="h-12 w-12 text-muted-foreground mb-4" />
        ) : type === 'sermon-simmer' ? (
          <Flame className="h-12 w-12 text-muted-foreground mb-4" />
        ) : type === 'study' ? (
          <Brain className="h-12 w-12 text-muted-foreground mb-4" />
        ) : (
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        )}
        <h3 className="text-lg font-medium mb-2">No sessions found</h3>
        <p className="text-muted-foreground max-w-sm">
          {type === 'sermon-writer' 
            ? "Start a new sermon in the Sermon Writer to see it here."
            : type === 'sermon-simmer'
            ? "Start a Sermon Simmer session to develop sermon ideas over 7 days."
            : type === 'study'
            ? "Start a Study Buddy session to track your Bible study journey."
            : "Start studying to see your sessions here."}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as SessionType)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">All</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {totalCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="study" className="gap-2">
            <Brain className="h-4 w-4" />
            <span className="hidden sm:inline">Study Buddy</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {studySessions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sermon-writer" className="gap-2">
            <Feather className="h-4 w-4" />
            <span className="hidden sm:inline">Sermons</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {sermonWriterSessions.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sermon-simmer" className="gap-2">
            <Flame className="h-4 w-4" />
            <span className="hidden sm:inline">Simmer</span>
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {sermonSimmerSessions.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {totalCount === 0 ? (
            renderEmptyState('all')
          ) : (
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStudySessions.map(renderStudySessionCard)}
                {filteredSermonWriterSessions.map(renderSermonWriterCard)}
                {filteredSermonSimmerSessions.map(renderSermonSimmerCard)}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="study" className="mt-6">
          {filteredStudySessions.length === 0 ? (
            renderEmptyState('study')
          ) : (
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredStudySessions.map(renderStudySessionCard)}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="sermon-writer" className="mt-6">
          {filteredSermonWriterSessions.length === 0 ? (
            renderEmptyState('sermon-writer')
          ) : (
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSermonWriterSessions.map(renderSermonWriterCard)}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="sermon-simmer" className="mt-6">
          {filteredSermonSimmerSessions.length === 0 ? (
            renderEmptyState('sermon-simmer')
          ) : (
            <ScrollArea className="h-[calc(100vh-350px)]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredSermonSimmerSessions.map(renderSermonSimmerCard)}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
