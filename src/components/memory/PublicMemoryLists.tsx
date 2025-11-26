import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MemoryListCard } from "./MemoryListCard";
import { Loader2 } from "lucide-react";

interface PublicMemoryListsProps {
  userId: string;
}

export function PublicMemoryLists({ userId }: PublicMemoryListsProps) {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const { data, error } = await supabase
        .from("memory_verse_lists")
        .select(`
          *,
          memory_verse_list_items(count)
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLists(data || []);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (lists.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-2">No public lists available</p>
        <p className="text-sm text-muted-foreground">
          Be the first to create a public memory list!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lists.map((list) => (
        <MemoryListCard
          key={list.id}
          list={list}
          onUpdate={fetchLists}
          isOwner={list.user_id === userId}
        />
      ))}
    </div>
  );
}
