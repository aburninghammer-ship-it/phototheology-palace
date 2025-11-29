import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Edit,
  Trash2,
  Copy,
  BookOpen,
  Clock,
  BarChart,
  Loader2,
} from "lucide-react";
import { SavedReadingSequence, ROOM_TAG_OPTIONS } from "@/types/readingSequence";
import { formatDistanceToNow } from "date-fns";
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

interface SavedSequencesListProps {
  sequences: SavedReadingSequence[];
  isLoading: boolean;
  onPlay: (sequence: SavedReadingSequence) => void;
  onEdit: (sequence: SavedReadingSequence) => void;
  onDelete: (id: string) => void;
  onDuplicate: (sequence: SavedReadingSequence) => void;
}

export const SavedSequencesList = ({
  sequences,
  isLoading,
  onPlay,
  onEdit,
  onDelete,
  onDuplicate,
}: SavedSequencesListProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your sequences...</p>
        </CardContent>
      </Card>
    );
  }

  if (sequences.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">No saved sequences yet.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first reading sequence above!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTotalChapters = (seq: SavedReadingSequence) => {
    return seq.sequences.reduce((acc, s) => acc + s.items.length, 0);
  };

  const getPreviewText = (seq: SavedReadingSequence) => {
    const items = seq.sequences.flatMap((s) => s.items).slice(0, 4);
    const preview = items.map((i) => `${i.book} ${i.chapter}`).join(" → ");
    const remaining = getTotalChapters(seq) - items.length;
    return remaining > 0 ? `${preview} + ${remaining} more` : preview;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          My Reading Sequences
          <Badge variant="secondary">{sequences.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {sequences.map((seq) => (
              <div
                key={seq.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{seq.name}</h4>
                    {seq.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                        {seq.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {getPreviewText(seq)}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {seq.roomTags.map((tag) => {
                        const tagInfo = ROOM_TAG_OPTIONS.find((t) => t.value === tag);
                        return (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {tagInfo?.label || tag}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => onPlay(seq)}
                    >
                      <Play className="h-3 w-3" />
                      Play
                    </Button>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => onEdit(seq)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => onDuplicate(seq)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Sequence?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete "{seq.name}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(seq.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {getTotalChapters(seq)} chapters
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart className="h-3 w-3" />
                    {seq.playCount} plays
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(seq.updatedAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
