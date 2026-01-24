import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Calendar,
  Trash2,
  Play,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { useSaveDrill, SavedDrillSession } from "@/hooks/useSaveDrill";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavedDrillsListProps {
  roomId?: string;
  mode?: string;
  limit?: number;
  onSelect?: (drill: SavedDrillSession) => void;
  showActions?: boolean;
}

export const SavedDrillsList = ({
  roomId,
  mode,
  limit = 10,
  onSelect,
  showActions = true,
}: SavedDrillsListProps) => {
  const { user } = useAuth();
  const { getSavedDrills, deleteDrillSession, saving } = useSaveDrill();
  const [drills, setDrills] = useState<SavedDrillSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDrills = async () => {
    setLoading(true);
    const results = await getSavedDrills({ room_id: roomId, mode, limit });
    setDrills(results);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchDrills();
    }
  }, [user, roomId, mode, limit]);

  const handleDelete = async (id: string) => {
    const success = await deleteDrillSession(id);
    if (success) {
      setDrills((prev) => prev.filter((d) => d.id !== id));
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Please sign in to view saved drills</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (drills.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No saved drills yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Complete a drill and save it to see it here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Saved Drills
        </CardTitle>
        <CardDescription>Your saved drill sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {drills.map((drill) => (
              <div
                key={drill.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {drill.name || drill.verse_reference}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {drill.mode}
                    </Badge>
                    {drill.drill_data?.room_id && (
                      <Badge variant="secondary" className="text-xs">
                        {drill.drill_data.room_id}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(drill.created_at), "MMM d")}
                    </span>
                  </div>
                </div>

                {showActions && (
                  <div className="flex items-center gap-1 ml-2">
                    {onSelect && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelect(drill)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Drill</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this saved drill? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(drill.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
