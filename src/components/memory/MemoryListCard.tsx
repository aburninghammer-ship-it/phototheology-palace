import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book, Users, Lock, Globe, Play, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MemoryListCardProps {
  list: any;
  onUpdate: () => void;
  isOwner: boolean;
}

export function MemoryListCard({ list, onUpdate, isOwner }: MemoryListCardProps) {
  const navigate = useNavigate();
  const verseCount = list.memory_verse_list_items?.[0]?.count || 0;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this list?")) return;

    try {
      const { error } = await supabase
        .from("memory_verse_lists")
        .delete()
        .eq("id", list.id);

      if (error) throw error;
      toast.success("List deleted");
      onUpdate();
    } catch (error) {
      console.error("Error deleting list:", error);
      toast.error("Failed to delete list");
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{list.title}</CardTitle>
            {list.topic && (
              <CardDescription className="line-clamp-1">{list.topic}</CardDescription>
            )}
          </div>
          {list.is_public ? (
            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          ) : (
            <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Book className="h-4 w-4" />
            <span>{verseCount} / {list.target_verse_count}</span>
          </div>
          {list.is_collaborative && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Team</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {list.bible_version.toUpperCase()}
          </Badge>
        </div>

        {list.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {list.description}
          </p>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={() => navigate(`/memory/play/${list.id}`)}
            className="flex-1 gap-2"
            disabled={verseCount === 0}
          >
            <Play className="h-4 w-4" />
            Play
          </Button>
          
          {isOwner && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(`/memory/list/${list.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
